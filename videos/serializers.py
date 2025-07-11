from rest_framework import serializers
from .models import Video
from accounts.serializers import CreatorProfileSerializer
from contests.serializers import ContestSerializer

class VideoSerializer(serializers.ModelSerializer):
    creator_profile = serializers.SerializerMethodField()
    creator_name = serializers.SerializerMethodField()
    duration_str = serializers.SerializerMethodField()
    contest_details = ContestSerializer(source='contest', read_only=True)
    submission_status = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id', 'title', 'description', 'url', 'thumbnail',
            'category', 'views', 'likes', 'duration_str',
            'is_featured', 'created_at', 'creator_profile', 'creator_name',
            'contest_details', 'submission_status', 'approval_status',
            'approval_date', 'approval_notes'
        ]

    def get_duration_str(self, obj):
        if not obj.duration:
            return None
        total_seconds = int(obj.duration.total_seconds())
        minutes = total_seconds // 60
        seconds = total_seconds % 60
        return f"{minutes}:{seconds:02d}"

    def get_submission_status(self, obj):
        if obj.submission:
            return obj.submission.status
        return None

    def get_creator_name(self, obj):
        if obj.creator:
            return f'{obj.creator.first_name} {obj.creator.last_name}'.strip() or 'Anonymous'
        return 'Anonymous'

    def get_creator_profile(self, obj):
        if hasattr(obj.creator, 'creator_profile'):
            profile = obj.creator.creator_profile
            return {
                'id': obj.creator.id,
                'name': f'{obj.creator.first_name} {obj.creator.last_name}'.strip() or 'Anonymous',
                'bio': profile.bio,
                'country': profile.country,
                'profilePicture': profile.profile_picture.url if profile.profile_picture else None,
                'experienceLevel': profile.experience_level
            }
        return None

    def get_url(self, obj):
        if obj.url:
            return obj.url.url
        return None

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Format created_at to ISO format
        if instance.created_at:
            data['created_at'] = instance.created_at.isoformat()
        return data


class VideoUploadSerializer(serializers.ModelSerializer):
    """
    Serializer for video uploads with additional validation.
    """
    video = serializers.FileField(
        required=True,
        write_only=True,
        help_text='Video file (MP4, WebM, or QuickTime format, max 500MB)'
    )
    
    class Meta:
        model = Video
        fields = ['video', 'title', 'description', 'category']
        extra_kwargs = {
            'title': {'required': True, 'allow_blank': False},
            'description': {'required': False, 'allow_blank': True},
            'category': {'required': False},
        }
    
    def validate_video(self, value):
        """
        Validate the uploaded video file.
        """
        # Check file size (max 500MB)
        max_size = 500 * 1024 * 1024  # 500MB in bytes
        if value.size > max_size:
            raise serializers.ValidationError('Video file too large. Maximum size is 500MB.')
        
        # Check file type
        valid_mime_types = [
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'video/x-msvideo',
            'video/x-ms-wmv',
            'video/x-flv',
            'video/3gpp',
            'video/3gpp2',
        ]
        
        if hasattr(value, 'content_type') and value.content_type not in valid_mime_types:
            raise serializers.ValidationError('Unsupported file type. Please upload a video file.')
        
        # Check file extension
        import os
        ext = os.path.splitext(value.name)[1].lower()
        valid_extensions = ['.mp4', '.webm', '.mov', '.avi', '.wmv', '.flv', '.3gp', '.3g2']
        if ext not in valid_extensions:
            raise serializers.ValidationError('Unsupported file extension. Please upload a video file with a valid extension.')
        
        return value
    
    def create(self, validated_data):
        """
        Create and return a new Video instance, given the validated data.
        """
        # Remove the video file from validated_data and handle it separately
        video_file = validated_data.pop('video')
        
        # Check if approval_status is already in validated_data
        if 'approval_status' not in validated_data:
            validated_data['approval_status'] = Video.ApprovalStatus.PENDING
        
        # Set default values if not provided
        if 'is_standalone' not in validated_data:
            validated_data['is_standalone'] = True
            
        # Create the video instance
        video = Video.objects.create(
            **validated_data,
            url=video_file,  # This will be handled by FileField's upload_to
            thumbnail=None  # Thumbnail will be generated by a signal or task
        )
        
        # Generate thumbnail (this would typically be done by a background task)
        # self._generate_thumbnail(video)
        
        return video
    
    def _generate_thumbnail(self, video):
        """
        Generate a thumbnail from the video.
        This is a placeholder - in a real app, you would use a library like ffmpeg.
        """
        # This is a placeholder - in a real app, you would:
        # 1. Extract a frame from the video using ffmpeg
        # 2. Save it as an image file
        # 3. Set it as the video's thumbnail
        pass
