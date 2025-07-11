from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from accounts.models import CreatorProfile
from contests.models import Contest, Submission
from datetime import timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates sample data for testing'

    def handle(self, *args, **options):
        # Create test brand user
        brand_user, created = User.objects.get_or_create(
            email='brand@example.com',
            defaults={
                'first_name': 'Test',
                'last_name': 'Brand',
                'is_active': True,
                'role': 'brand'
            }
        )
        if created:
            brand_user.set_password('testpass123')
            brand_user.save()
            self.stdout.write(self.style.SUCCESS('Created test brand user'))

        # Create test creator user
        creator_user, created = User.objects.get_or_create(
            email='creator@example.com',
            defaults={
                'first_name': 'Test',
                'last_name': 'Creator',
                'is_active': True,
                'role': 'creator'
            }
        )
        if created:
            creator_user.set_password('testpass123')
            creator_user.save()
            self.stdout.write(self.style.SUCCESS('Created test creator user'))

        # Create or get creator profile
        creator_profile, created = CreatorProfile.objects.get_or_create(
            user=creator_user,
            defaults={
                'bio': 'Test creator bio',
                'phone_number': '+1234567890',
                'country': 'US',
                'address': '123 Test St, Test City, 12345',
                'portfolio_url': 'https://example.com/portfolio',
                'facebook_url': 'https://facebook.com/testcreator',
                'twitter_url': 'https://twitter.com/testcreator',
                'instagram_url': 'https://instagram.com/testcreator',
                'linkedin_url': 'https://linkedin.com/in/testcreator',
                'youtube_url': 'https://youtube.com/testcreator',
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Created creator profile'))

        # Create sample contests
        contest_titles = [
            'Summer Video Challenge',
            'Urban Photography Contest',
            'Nature Documentary Series',
            'Tech Product Showcase',
            'Travel Vlog Competition'
        ]

        for title in contest_titles:
            contest, created = Contest.objects.get_or_create(
                title=title,
                defaults={
                    'description': f'Sample contest: {title}',
                    'prize': random.randint(500, 5000),
                    'brand': brand_user,
                    'created_at': timezone.now() - timedelta(days=30),
                    'deadline': timezone.now() + timedelta(days=30),
                    'status': 'active'
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created contest: {title}'))

        # Create sample submissions
        contests = Contest.objects.all()
        for contest in contests:
            submission, created = Submission.objects.get_or_create(
                creator=creator_profile,
                contest=contest,
                defaults={
                    'title': f'Sample submission for {contest.title}',
                    'description': 'Sample submission description',
                    'video_url': 'https://example.com/sample-video.mp4',
                    'status': random.choice(['pending', 'approved', 'rejected']),
                    'views': random.randint(100, 1000)
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created submission for contest: {contest.title}'))

        self.stdout.write(self.style.SUCCESS('Successfully created sample data'))
