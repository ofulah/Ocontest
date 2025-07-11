from rest_framework import serializers
from .models import Contest, Submission, ContestApplication
from accounts.models import Product

class ContestSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.get_full_name', read_only=True)
    submission_count = serializers.SerializerMethodField()

    class Meta:
        model = Contest
        fields = [
            'id', 'title', 'description', 'brand', 'brand_name',
            'prize', 'deadline', 'status', 'thumbnail', 'is_featured',
            'view_count', 'submission_count', 'created_at', 'brief',
            'inspiration', 'rules', 'region', 'language', 'max_entries'
        ]
        read_only_fields = ['brand', 'brand_info', 'status', 'view_count', 'submission_count', 'created_at']

    def validate_max_entries(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError('Maximum entries must be greater than 0')
        return value

    def validate_prize(self, value):
        if value <= 0:
            raise serializers.ValidationError('Prize amount must be greater than 0')
        return value

    def validate_thumbnail(self, value):
        if value and value.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError('Image file too large. Size should not exceed 5MB.')
        return value
    
    def get_submission_count(self, obj):
        return obj.submissions.count()

class FeaturedContestSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.get_full_name', read_only=True)
    prize_display = serializers.SerializerMethodField()

    class Meta:
        model = Contest
        fields = [
            'id', 'title', 'brand_info', 'prize', 'prize_display',
            'thumbnail', 'view_count', 'status'
        ]
    
    def get_brand_info(self, obj):
        user = obj.brand
        if hasattr(user, 'brandprofile') and user.brandprofile and user.brandprofile.company_name:
            name = user.brandprofile.company_name
        elif user.first_name:
            name = user.first_name.split('(')[0].strip()
        else:
            name = user.email
        return {
            'id': user.id,
            'name': name
        }

    def get_prize_display(self, obj):
        return f"${int(obj.prize):,}"


class ContestDetailSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.get_full_name', read_only=True)
    submission_count = serializers.SerializerMethodField()
    submissions = serializers.SerializerMethodField()

    class Meta:
        model = Contest
        fields = [
            'id', 'title', 'description', 'brand', 'brand_name',
            'prize', 'deadline', 'status', 'thumbnail', 'is_featured',
            'view_count', 'submission_count', 'submissions', 'rules',
            'created_at', 'updated_at'
        ]
    
    def get_submission_count(self, obj):
        return obj.submissions.count()
    
    def get_submissions(self, obj):
        # Only return approved submissions
        submissions = obj.submissions.filter(status='approved')
        return SubmissionSerializer(submissions, many=True).data


class SubmissionSerializer(serializers.ModelSerializer):
    creator_name = serializers.SerializerMethodField()
    contest_title = serializers.CharField(source='contest.title', read_only=True)
    video_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = [
            'id', 'creator', 'creator_name', 'contest', 'contest_title',
            'title', 'description', 'video_file', 'video_url', 'thumbnail_url', 'status', 'status_display',
            'feedback', 'tags', 'created_at', 'updated_at', 'terms_accepted'
        ]
        read_only_fields = ['creator', 'status', 'feedback', 'terms_accepted_at']

    def get_creator_name(self, obj):
        if obj.creator:
            if obj.creator.first_name or obj.creator.last_name:
                return f"{obj.creator.first_name} {obj.creator.last_name}".strip()
            return obj.creator.email
        return None

    def get_video_url(self, obj):
        try:
            if obj.video_file and hasattr(obj.video_file, 'url'):
                return obj.video_file.url
        except Exception:
            pass
        return None

    def get_thumbnail_url(self, obj):
        try:
            if obj.thumbnail and hasattr(obj.thumbnail, 'url'):
                return obj.thumbnail.url
        except Exception:
            pass
        return None

    def get_status_display(self, obj):
        return obj.get_status_display() if obj.status else None

    def validate_terms_accepted(self, value):
        if not value:
            raise serializers.ValidationError('You must accept the terms and conditions')
        return value


class ContestApplicationSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='creator.get_full_name', read_only=True)
    contest_title = serializers.CharField(source='contest.title', read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True,
        required=True
    )
    shipping_address = serializers.JSONField(write_only=True)

    class Meta:
        model = ContestApplication
        fields = [
            'id', 'contest', 'creator', 'creator_name', 'contest_title',
            'status', 'terms_accepted', 'notes', 'created_at', 'updated_at',
            'shipping_address_line1', 'shipping_city', 'shipping_state',
            'shipping_postal', 'shipping_country', 'product', 'product_id',
            'full_name', 'shipping_address'
        ]
        read_only_fields = ['creator', 'status', 'contest', 'product']

    def validate_terms_accepted(self, value):
        if not value:
            raise serializers.ValidationError('You must accept the terms and conditions')
        return value
        
    def validate_shipping_address(self, value):
        required_fields = ['line1', 'city', 'country', 'postal']
        for field in required_fields:
            if not value.get(field):
                raise serializers.ValidationError(f'Shipping address {field} is required')
        return value
        
    def create(self, validated_data):
        # Extract shipping address data
        shipping_address = validated_data.pop('shipping_address', {})
        
        # Map shipping address fields to model fields
        address_mapping = {
            'line1': 'shipping_address_line1',
            'city': 'shipping_city',
            'state': 'shipping_state',
            'postal': 'shipping_postal',
            'country': 'shipping_country'
        }
        
        for field, model_field in address_mapping.items():
            if field in shipping_address:
                validated_data[model_field] = shipping_address[field]
        
        return super().create(validated_data)
