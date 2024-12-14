from django.urls import path
from .views import AccessShareableLinkView, FileDownloadView, FileListView, FileShareAccessView, FileShareView, FileUploadView, GenerateShareableLinkView, SharedWithMeListView

urlpatterns = [
    path('files/', FileListView.as_view(), name='file-list'),
    path('files/upload/', FileUploadView.as_view(), name='file-upload'),
    path('files/<uuid:pk>/download/', FileDownloadView.as_view(), name='file-download'),
    path('file-shares/', FileShareView.as_view(), name='file-share'),
    path('file-shares/<uuid:pk>/access/', FileShareAccessView.as_view(), name='file-share-access'),
    path('files-shared-with-me/', SharedWithMeListView.as_view(), name='shared-with-me'),
    path('generate-shareable-link/', GenerateShareableLinkView.as_view(), name='generate-shareable-link'),
    path('shared-link/<uuid:link_id>/', AccessShareableLinkView.as_view(), name='access-shareable-link'),
]
