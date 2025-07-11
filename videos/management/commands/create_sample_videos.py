from django.core.management.base import BaseCommand
from django.core.files import File
from django.contrib.auth import get_user_model
from videos.models import Video
from accounts.models import CreatorProfile
import os
from datetime import timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates sample videos with creators'

    def handle(self, *args, **kwargs):
        # Create sample creators if they don't exist
        creators_data = [
            {
                'email': 'riz@example.com',
                'password': 'testpass123',
                'first_name': 'Riz',
                'last_name': 'Thompson',
                'profile': {
                    'bio': 'Motion graphics artist specializing in color theory and abstract design.',
                    'country': 'United States',
                    'experience_level': 'expert'
                }
            },
            {
                'email': 'jordan@example.com',
                'password': 'testpass123',
                'first_name': 'Jordan',
                'last_name': 'Biagomala',
                'profile': {
                    'bio': 'Experimental animator pushing the boundaries of digital art.',
                    'country': 'Canada',
                    'experience_level': 'professional'
                }
            },
            {
                'email': 'filmcraft@example.com',
                'password': 'testpass123',
                'first_name': 'Film',
                'last_name': 'Craft',
                'profile': {
                    'bio': 'Documentary filmmakers capturing the essence of creative processes.',
                    'country': 'United Kingdom',
                    'experience_level': 'professional'
                }
            },
            {
                'email': 'urbanlens@example.com',
                'password': 'testpass123',
                'first_name': 'Urban',
                'last_name': 'Lens',
                'profile': {
                    'bio': 'Street photography and videography collective capturing urban life.',
                    'country': 'France',
                    'experience_level': 'expert'
                }
            }
        ]

        # Create creators
        creators = {}
        for creator_data in creators_data:
            profile_data = creator_data.pop('profile')
            user, created = User.objects.get_or_create(
                email=creator_data['email'],
                defaults={
                    **creator_data,
                    'role': 'creator',
                    'is_active': True,
                    'is_verified': True
                }
            )
            if created:
                user.set_password(creator_data['password'])
                user.save()
                
                # Create creator profile
                CreatorProfile.objects.create(
                    user=user,
                    **profile_data
                )
                self.stdout.write(self.style.SUCCESS(f'Created creator: {user.email}'))
            creators[user.email] = user

        # Sample videos data
        videos_data = [
            {
                'title': 'RED by Riz',
                'description': 'A vibrant exploration of the color red through motion and design.',
                'creator_email': 'riz@example.com',
                'category': 'motion_graphics',
                'duration': timedelta(minutes=1, seconds=45),
                'is_featured': True,
                'views': 1200,
                'likes': 89
            },
            {
                'title': 'YELLOW by Jordan Biagomala',
                'description': 'An artistic journey through yellow tones and abstract shapes.',
                'creator_email': 'jordan@example.com',
                'category': 'animation',
                'duration': timedelta(minutes=2, seconds=10),
                'is_featured': True,
                'views': 950,
                'likes': 76
            },
            {
                'title': 'Directors Vision',
                'description': 'Behind the scenes look at a directors creative process.',
                'creator_email': 'filmcraft@example.com',
                'category': 'documentary',
                'duration': timedelta(minutes=1, seconds=30),
                'is_featured': False,
                'views': 2100,
                'likes': 156
            },
            {
                'title': 'Dance in the City',
                'description': 'Spontaneous urban dance performance capturing joy and freedom.',
                'creator_email': 'urbanlens@example.com',
                'category': 'performance',
                'duration': timedelta(minutes=1, seconds=20),
                'is_featured': True,
                'views': 1800,
                'likes': 142
            }
        ]

        # Create videos
        for video_data in videos_data:
            creator_email = video_data.pop('creator_email')
            creator = creators[creator_email]
            
            video, created = Video.objects.get_or_create(
                title=video_data['title'],
                defaults={
                    **video_data,
                    'creator': creator,
                    'url': f'/videos/library/{video_data["title"].replace(" ", "-")}.mp4',
                    'approval_status': Video.ApprovalStatus.APPROVED,
                    'is_public': True
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created video: {video.title}'))

        self.stdout.write(self.style.SUCCESS('Successfully created sample videos and creators'))
