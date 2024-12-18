from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import File, FileShare, ShareableLink
from .serializers import FileSerializer, FileShareSerializer, FileSharedSerializer, ShareableLinkSerializer
from .encryption import encrypt_file, decrypt_file
from django.http import FileResponse
from datetime import *
from django.utils import timezone

class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        encrypted_file, key = encrypt_file(file)
        
        # Reset the file pointer of encrypted_file before passing it to the serializer
        encrypted_file.seek(0)
        serializer = FileSerializer(data={'name': file.name, 'file': encrypted_file})
        
        if serializer.is_valid():
            serializer.save(uploaded_by=request.user, encrypted_key=key)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FileListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        files = File.objects.filter(uploaded_by=request.user)
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data)

class FileDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            file = File.objects.get(pk=pk, uploaded_by=request.user)
        except File.DoesNotExist:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

        decrypted_file = decrypt_file(file.file, file.encrypted_key)

        response = FileResponse(decrypted_file, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'
        return response

class FileShareView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FileShareSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FileShareAccessView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            file_share = FileShare.objects.get(pk=pk, shared_with=request.user)
        except FileShare.DoesNotExist:
            return Response({'error': 'Shared file not found'}, status=status.HTTP_404_NOT_FOUND)

        if file_share.is_expired():
            return Response({'error': 'This share has expired.'}, status=status.HTTP_403_FORBIDDEN)

        file = File.objects.get(pk=file_share.file.id)
        if file_share.permission == 'VIEW':
            serializer = FileSerializer(file_share.file)
            return Response(serializer.data)
        elif file_share.permission == 'DOWNLOAD':
            return self.download_file(file)

    def download_file(self, file):
        decrypted_file = decrypt_file(file.file, file.encrypted_key)
        response = FileResponse(decrypted_file, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'
        return response

class SharedWithMeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        shared_files = FileShare.objects.filter(shared_with=request.user)
        serializer = FileSharedSerializer(shared_files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GenerateShareableLinkView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_id = request.data.get('file_id')

        if not file_id:
            return Response({'error': 'file_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            file = File.objects.get(pk=file_id, uploaded_by=request.user)
        except File.DoesNotExist:
            return Response({'error': 'File not found.'}, status=status.HTTP_404_NOT_FOUND)

        expires_at = timezone.now() + timezone.timedelta(hours=1)
        shareable_link = ShareableLink.objects.create(
            file=file,
            created_by=request.user,
            expires_at=expires_at
        )

        serializer = ShareableLinkSerializer(shareable_link)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AccessShareableLinkView(APIView):
    def get(self, request, link_id):
        try:
            shareable_link = ShareableLink.objects.get(pk=link_id)
        except ShareableLink.DoesNotExist:
            return Response({'error': 'Link not found.'}, status=status.HTTP_404_NOT_FOUND)

        if shareable_link.is_expired():
            return Response({'error': 'This link has expired.'}, status=status.HTTP_410_GONE)

        serializer = ShareableLinkSerializer(shareable_link)
        return Response(serializer.data)