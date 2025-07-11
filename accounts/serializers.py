from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CreatorProfile, BrandProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'confirm_password', 'role', 'phone_number', 'first_name', 'last_name')
        extra_kwargs = {
            'id': {'read_only': True},
        }

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"password": ["Passwords do not match"]})
        
        # Check if email already exists
        email = data.get('email')
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": ["A user with this email address already exists"]})
        
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user

class CreatorProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', required=False, allow_blank=True)
    last_name = serializers.CharField(source='user.last_name', required=False, allow_blank=True)
    gender = serializers.CharField(source='user.gender', required=False, allow_blank=True)
    phone_number = serializers.CharField(source='user.phone_number', required=False, allow_blank=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    # Frontend alias camelCase
    profilePicture = serializers.ImageField(required=False, allow_null=True, write_only=True, source='profile_picture')
    social_media_links = serializers.JSONField(required=False, write_only=True)
    
    # Shipping address as a nested object
    shipping_address = serializers.SerializerMethodField()
    
    # Individual social media fields
    # Accept both *_url and plain keys coming from the frontend
    facebook_url = serializers.URLField(required=False, allow_blank=True)
    instagram_url = serializers.URLField(required=False, allow_blank=True)
    twitter_url = serializers.URLField(required=False, allow_blank=True)
    # Write-only aliases matching the frontend keys (facebook, instagram, twitter)
    facebook = serializers.URLField(required=False, allow_blank=True, write_only=True)
    instagram = serializers.URLField(required=False, allow_blank=True, write_only=True)
    twitter = serializers.URLField(required=False, allow_blank=True, write_only=True)
    tiktok_url = serializers.URLField(required=False, allow_blank=True)
    youtube_url = serializers.URLField(required=False, allow_blank=True)
    portfolio_url = serializers.URLField(required=False, allow_blank=True)
    
    class Meta:
        model = CreatorProfile
        fields = [
            'id', 'email', 'first_name', 'last_name', 'gender', 'phone_number', 'bio', 'address',
            'experience_level', 'profile_picture', 'profilePicture', 'banner_image', 'portfolio_url', 'social_media_links',
            'receive_sms_notifications', 'total_earnings', 'contest_wins', 'contest_participations',
            'shipping_address_line1', 'shipping_address_line2', 'shipping_city', 'shipping_state',
            'shipping_postal_code', 'shipping_country', 'shipping_address', 'created_at', 'updated_at',
            'facebook_url', 'instagram_url', 'twitter_url', 'tiktok_url', 'youtube_url', 'facebook', 'instagram', 'twitter'
        ]
        read_only_fields = ['user', 'total_earnings', 'contest_wins', 'contest_participations']
    
    def get_shipping_address(self, obj):
        """Combine the individual address fields into a single address object."""
        if not obj.shipping_address_line1 and not obj.shipping_city and not obj.shipping_country:
            return None
            
        return {
            'line1': obj.shipping_address_line1 or '',
            'line2': obj.shipping_address_line2 or '',
            'city': obj.shipping_city or '',
            'state': obj.shipping_state or '',
            'postal': obj.shipping_postal_code or '',
            'country': obj.shipping_country or ''
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Format name and profile fields to match frontend expectations
        first_name = instance.user.first_name if instance.user.first_name else ''
        last_name = instance.user.last_name if instance.user.last_name else ''
        data['name'] = f"{first_name} {last_name}".strip() or 'Anonymous'
        data['profilePicture'] = data.pop('profile_picture') if data.get('profile_picture') else None
        data['experienceLevel'] = data.pop('experience_level')
        
        # Remove redundant name fields
        data.pop('first_name', None)
        data.pop('last_name', None)
        # Keep gender field for form persistence
        # data.pop('gender', None)
        
        # Get social media links from individual fields
        social_links = {
            'facebook': getattr(instance, 'facebook_url', ''),
            'instagram': getattr(instance, 'instagram_url', ''),
            'twitter': getattr(instance, 'twitter_url', ''),
            'tiktok': getattr(instance, 'tiktok_url', ''),
            'youtube': getattr(instance, 'youtube_url', ''),
            'portfolio': getattr(instance, 'portfolio_url', '')
        }
        
        # Update data with individual social media fields
        for key, value in social_links.items():
            if value:
                data[f"{key}_url"] = value
        
        # Format dates
        if data.get('created_at'):
            data['created_at'] = instance.created_at.isoformat()
        if data.get('updated_at'):
            data['updated_at'] = instance.updated_at.isoformat()
            
        # Remove the raw social_media_links from the response since we have individual fields
        data.pop('social_media_links', None)
            
        return data
        
    def update(self, instance, validated_data):
        # Handle user data if present
        user_data = {}
        if 'user' in validated_data:
            if isinstance(validated_data['user'], str):
                import json
                user_data = json.loads(validated_data.pop('user'))
            else:
                user_data = validated_data.pop('user', {})
        
        # Handle social_media_links if provided as a JSON string or dict
        social_media_links = {}
        if 'social_media_links' in validated_data:
            if isinstance(validated_data['social_media_links'], str):
                import json
                try:
                    social_media_links = json.loads(validated_data.pop('social_media_links'))
                except (TypeError, json.JSONDecodeError):
                    pass
            else:
                social_media_links = validated_data.pop('social_media_links', {})
        
        # Handle individual social media fields
        social_media_fields = {
            'facebook_url': 'facebook',
            'instagram_url': 'instagram',
            'twitter_url': 'twitter',
            # Aliases coming directly from frontend
            'facebook': 'facebook',
            'instagram': 'instagram',
            'twitter': 'twitter',
            'tiktok_url': 'tiktok',
            'youtube_url': 'youtube',
            'portfolio_url': 'portfolio'
        }
        
        # Update social_media_links with values from individual fields
        for field, key in social_media_fields.items():
            if field in validated_data:
                value = validated_data.pop(field)
                if value:
                    social_media_links[key] = value
                elif key in social_media_links:
                    del social_media_links[key]
        
        # Update social_media_links field
        if social_media_links:
            validated_data['social_media_links'] = social_media_links

        # Handle user direct fields (gender, phone_number) if present
        if 'gender' in validated_data:
            instance.user.gender = validated_data.pop('gender')
        if 'phone_number' in validated_data:
            instance.user.phone_number = validated_data.pop('phone_number')
        instance.user.save()
        
        # Update individual fields on the instance
        for field, key in social_media_fields.items():
            # Only set attributes that actually exist on the model (skip alias fields)
            if not hasattr(instance, field):
                continue
            if key in social_media_links:
                setattr(instance, field, social_media_links[key])
            else:
                setattr(instance, field, '')
        
        # Update User fields if any
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                if hasattr(user, attr):
                    setattr(user, attr, value)
            user.save()
        
        # Handle social_media_links if it's a string
        if 'social_media_links' in validated_data and isinstance(validated_data['social_media_links'], str):
            try:
                validated_data['social_media_links'] = json.loads(validated_data['social_media_links'])
            except (TypeError, json.JSONDecodeError):
                validated_data['social_media_links'] = {}
        
        # Handle file uploads
        if 'profile_picture' in validated_data and validated_data['profile_picture'] is None:
            # If profile_picture is explicitly set to None, clear the existing picture
            instance.profile_picture.delete(save=False)
        
        # Update CreatorProfile fields
        for attr, value in validated_data.items():
            if hasattr(instance, attr):
                setattr(instance, attr, value)
        
        instance.save()
        return instance

class BrandProfileSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()
    name = serializers.CharField(source='company_name')

    class Meta:
        model = BrandProfile
        fields = [
            'id', 'email', 'name', 'company_logo', 'bio', 'country',
            'physical_address', 'contact_email', 'contact_person', 'contact_phone',
            'company_type', 'industry_type', 'website_url', 'social_media_links',
            'contests_created', 'total_prize_money', 'created_at', 'updated_at'
        ]

    def get_email(self, obj):
        return obj.user.email

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['profilePicture'] = data.pop('profile_picture') if data.get('profile_picture') else None
        
        # Format dates
        if data.get('created_at'):
            data['created_at'] = instance.created_at.isoformat()
        if data.get('updated_at'):
            data['updated_at'] = instance.updated_at.isoformat()
            
        return data

class PublicCreatorProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    joined_date = serializers.SerializerMethodField()
    total_videos = serializers.SerializerMethodField()
    total_contests = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    skills = serializers.SerializerMethodField()
    website = serializers.SerializerMethodField()
    social_links = serializers.SerializerMethodField()
    banner_image = serializers.ImageField(read_only=True)

    class Meta:
        model = CreatorProfile
        fields = [
            'full_name', 'email', 'bio', 'location', 'skills',
            'profile_picture', 'experience_level', 'joined_date',
            'total_videos', 'total_contests', 'website', 'social_links', 'banner_image'
        ]

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or 'Anonymous'

    def get_email(self, obj):
        return obj.user.email
        
    def get_joined_date(self, obj):
        return obj.user.date_joined
        
    def get_total_videos(self, obj):
        from videos.models import Video
        return Video.objects.filter(
            creator=obj.user,
            approval_status='approved'
        ).count()
        
    def get_total_contests(self, obj):
        from contests.models import ContestApplication
        return ContestApplication.objects.filter(creator=obj.user, status='approved').count()
        
    def get_location(self, obj):
        if obj.country:
            if obj.address:
                return f"{obj.address}, {obj.country}"
            return obj.country
        return obj.address or ''
        
    def get_skills(self, obj):
        return obj.specialties
        
    def get_website(self, obj):
        return obj.portfolio_url
        
    def get_social_links(self, obj):
        return obj.social_media_links

class PublicBrandProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='company_name')
    email = serializers.SerializerMethodField()
    joined_date = serializers.SerializerMethodField()
    total_contests = serializers.SerializerMethodField()
    total_prize_pool = serializers.SerializerMethodField()
    
    class Meta:
        model = BrandProfile
        fields = [
            'name', 'email', 'company_logo', 'bio', 'country', 'industry_type',
            'website_url', 'social_media_links', 'company_type', 'joined_date',
            'total_contests', 'total_prize_pool'
        ]
    
    def get_email(self, obj):
        return obj.user.email
    
    def get_joined_date(self, obj):
        return obj.created_at
    
    def get_total_contests(self, obj):
        return obj.contests_created
    
    def get_total_prize_pool(self, obj):
        return obj.total_prize_money

class BrandSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(required=True)
    industry = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'confirm_password', 'phone_number', 'company_name', 'industry']

    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})

        # Check if email already exists
        email = data.get('email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'A user with this email already exists.'})

        return data

    def create(self, validated_data):
        # Remove profile fields from user creation
        company_name = validated_data.pop('company_name')
        industry = validated_data.pop('industry')
        validated_data.pop('confirm_password')

        # Create user with brand role
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role='brand',
            phone_number=validated_data.get('phone_number', '')
        )

        # Create brand profile
        BrandProfile.objects.create(
            user=user,
            company_name=company_name,
            industry=industry
        )

        return user
