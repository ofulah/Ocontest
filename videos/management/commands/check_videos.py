from django.core.management.base import BaseCommand
from videos.models import Video

class Command(BaseCommand):
    help = 'Check video statuses in the database'

    def handle(self, *args, **options):
        # Get all videos
        all_videos = Video.objects.all()
        self.stdout.write(f"\nTotal videos: {all_videos.count()}")

        # Get approved videos
        approved_videos = Video.objects.filter(approval_status=Video.ApprovalStatus.APPROVED)
        self.stdout.write(f"\nApproved videos: {approved_videos.count()}")

        # Get public videos
        public_videos = Video.objects.filter(is_public=True)
        self.stdout.write(f"\nPublic videos: {public_videos.count()}")

        # Get approved AND public videos
        approved_public = Video.objects.filter(
            approval_status=Video.ApprovalStatus.APPROVED,
            is_public=True
        )
        self.stdout.write(f"\nApproved AND public videos: {approved_public.count()}")

        # Show details of each video
        self.stdout.write("\nVideo details:")
        for video in all_videos:
            self.stdout.write(
                f"\n- {video.title}"
                f"\n  Status: {video.approval_status}"
                f"\n  Public: {video.is_public}"
                f"\n  Creator: {video.creator.email}"
                f"\n  Created: {video.created_at}"
            )
