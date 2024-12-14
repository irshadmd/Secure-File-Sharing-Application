from rest_framework import serializers
from .models import File, FileShare, ShareableLink

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'file', 'uploaded_by', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_by', 'uploaded_at']

class FileShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileShare
        fields = ['id', 'file', 'shared_with', 'permission', 'expiration_time']
        read_only_fields = ['id']

class FileSharedSerializer(serializers.ModelSerializer):
    file = FileSerializer()
    class Meta:
        model = FileShare
        fields = ['id', 'file', 'shared_with', 'permission', 'expiration_time']
        read_only_fields = ['id']

class ShareableLinkSerializer(serializers.ModelSerializer):
    file = FileSerializer(read_only=True)
    shareable_url = serializers.SerializerMethodField()

    class Meta:
        model = ShareableLink
        fields = ['id', 'file', 'created_by', 'created_at', 'expires_at', 'shareable_url']

    def get_shareable_url(self, obj):
        request = self.context.get('request')
        if request is not None:
            return request.build_absolute_uri(f'/api/shared-link/{obj.id}/')
        return f'/api/shared-link/{obj.id}/'