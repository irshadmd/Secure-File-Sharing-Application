from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from .models import User
from .serializers import RegisterSerializer, UserSerializer
import pyotp

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.get(email=email)
            if check_password(password, user.password):
                refresh = RefreshToken.for_user(user)
                data = {
                    'token': str(refresh.access_token),
                    'user': UserSerializer(user).data
                }
                return Response(data, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class GetUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
    
class GetUserListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        users = User.objects.exclude(email=user.email)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GenerateMFASecretView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if not user.mfa_secret:
            user.mfa_secret = pyotp.random_base32()
            user.save()

        totp = pyotp.TOTP(user.mfa_secret)
        qr_code_url = totp.provisioning_uri(user.email, issuer_name="Secure_File_Sharing_Application")

        return Response({"secret": user.mfa_secret, "qr_code_url": qr_code_url}, status=status.HTTP_200_OK)

class ValidateOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        otp = request.data.get("otp")

        if not otp:
            return Response({"error": "OTP is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        totp = pyotp.TOTP(user.mfa_secret)
        is_valid = totp.verify(otp)

        if is_valid:
            user.is_mfa_enabled = True
            user.save()
            return Response({"success": True}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid OTP"}, status=status.HTTP_401_UNAUTHORIZED)

