from django.urls import path
from .views import FileDetailView, FileDownloadView, FileListView, FileShareAccessView, FileShareView, FileUploadView

urlpatterns = [
    path('files/', FileListView.as_view(), name='file-list'),
    path('files/upload/', FileUploadView.as_view(), name='file-upload'),
    path('files/<uuid:pk>/', FileDetailView.as_view(), name='file-detail'),
    path('files/<uuid:pk>/download/', FileDownloadView.as_view(), name='file-download'),
    path('file-shares/', FileShareView.as_view(), name='file-share'),
    path('file-shares/<uuid:pk>/access/', FileShareAccessView.as_view(), name='file-share-access'),
]
