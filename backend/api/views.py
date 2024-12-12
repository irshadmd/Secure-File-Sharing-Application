from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import File, FileShare
from .serializers import FileSerializer, FileShareSerializer
from .encryption import encrypt_file, decrypt_file
from django.http import FileResponse

class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        print(file.name)
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        encrypted_file, key = encrypt_file(file)
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

class FileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            file = File.objects.get(pk=pk, uploaded_by=request.user)
        except File.DoesNotExist:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = FileSerializer(file)
        return Response(serializer.data)

class FileDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            file = File.objects.get(pk=pk, uploaded_by=request.user)
        except File.DoesNotExist:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

        decrypted_file = decrypt_file(file.file.path, file.encrypted_key)
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

        if file_share.permission == 'view':
            serializer = FileSerializer(file_share.file)
            return Response(serializer.data)
        elif file_share.permission == 'download':
            return self.download_file(file_share.file)

    def download_file(self, file):
        decrypted_file = decrypt_file(file.file.path, file.encrypted_key)
        response = FileResponse(decrypted_file, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'
        return response

