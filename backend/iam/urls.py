from django.urls import path
from .views import GenerateMFASecretView, GetUserListView, GetUserView, RegisterView, LoginView, ValidateOTPView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('clientInfo/', GetUserView.as_view(), name='get-user'),
    path('users/', GetUserListView.as_view(), name='get-all-users'),
    path("mfa/generate/", GenerateMFASecretView.as_view(), name="mfa-generate"),
    path("mfa/validate/", ValidateOTPView.as_view(), name="mfa-validate"),
]
