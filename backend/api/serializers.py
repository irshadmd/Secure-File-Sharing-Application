from rest_framework import serializers
from .models import File, FileShare

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'file', 'uploaded_by', 'public_url', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_by', 'uploaded_at']

class FileShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileShare
        fields = ['id', 'file', 'shared_with', 'permission', 'expiration_time']
        read_only_fields = ['id']

