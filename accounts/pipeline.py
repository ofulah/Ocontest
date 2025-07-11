from .models import CreatorProfile

import json
import base64
from django.core.exceptions import ValidationError
from .models import CreatorProfile, BrandProfile

def get_role_from_state(backend, strategy, *args, **kwargs):
    """Get user role from state parameter"""
    state = strategy.session_get('state')
    if state:
        try:
            decoded = base64.b64decode(state).decode('utf-8')
            data = json.loads(decoded)
            return {'role': data.get('role', 'creator')}
        except:
            pass
    return {'role': 'creator'}

def create_user_profile(backend, user, response, details, is_new=False, *args, **kwargs):
    """
    Create user profile after successful social auth login/signup
    """
    # Get role from pipeline data
    role = kwargs.get('role', 'creator')
    
    # Set user role
    user.role = role
    user.save()
    
    # Create appropriate profile based on role
    if role == 'creator' and not hasattr(user, 'creator_profile'):
        # Set default role as creator for social auth users
        user.role = 'creator'
        user.save()
        
        # Create creator profile
        CreatorProfile.objects.create(
            user=user,
            first_name=details.get('first_name', ''),
            last_name=details.get('last_name', ''),
            profile_picture=response.get('picture', ''),
            experience_level='beginner',
            bio='',
            country='',
            address='',
            specialties=[],
            portfolio_url='',
            social_media_links={}
        )
    elif role == 'brand' and not hasattr(user, 'brand_profile'):
        # Create brand profile
        BrandProfile.objects.create(
            user=user,
            company_name=details.get('fullname', 'Company Name'),
            industry='Other',
            website='',
            description='',
            logo=response.get('picture', ''),
            contests_created=0,
            total_prize_money=0
        )
    return None
