from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    related_object_type = serializers.SerializerMethodField()
    related_object_id = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id',
            'notification_type',
            'title',
            'message',
            'is_read',
            'created_at',
            'related_object_type',
            'related_object_id'
        ]

    def get_related_object_type(self, obj):
        if obj.content_type:
            return obj.content_type.model
        return None

    def get_related_object_id(self, obj):
        return obj.object_id if obj.object_id else None
