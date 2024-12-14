from datetime import *
from django.utils import timezone
import uuid
from django.db import models

from iam.models import User

class File(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploads/')
    encrypted_key = models.BinaryField()
    public_url = models.URLField(blank=True, null=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class FileShare(models.Model):
    PERMISSION_CHOICES = [
        ('VIEW', 'View'),
        ('DOWNLOAD', 'Download'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.ForeignKey(File, on_delete=models.CASCADE)
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE)
    permission = models.CharField(max_length=10, choices=PERMISSION_CHOICES)
    expiration_time = models.DateTimeField(null=True, blank=True)

    def is_expired(self):
        return self.expiration_time and timezone.now() > self.expiration_time

    def __str__(self):
        return f"{self.file.name} shared with {self.shared_with.email}"


