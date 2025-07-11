from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from contests.models import Contest, Submission

class Video(models.Model):
    class Category(models.TextChoices):
        MOTION_GRAPHICS = 'motion_graphics', _('Motion Graphics')
        ANIMATION = 'animation', _('Animation')
        DOCUMENTARY = 'documentary', _('Documentary')
        PERFORMANCE = 'performance', _('Performance')
        OTHER = 'other', _('Other')

    class ApprovalStatus(models.TextChoices):
        PENDING = 'pending', _('Pending')
        APPROVED = 'approved', _('Approved')
        REJECTED = 'rejected', _('Rejected')

    title = models.CharField(max_length=200)
    description = models.TextField()
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='videos',
        limit_choices_to={'role': 'creator'}
    )
    url = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='video_thumbnails/', blank=True)
    category = models.CharField(
        max_length=50,
        choices=Category.choices,
        default=Category.OTHER
    )
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    duration = models.DurationField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approval_status = models.CharField(
        max_length=20,
        choices=ApprovalStatus.choices,
        default=ApprovalStatus.PENDING
    )
    approval_date = models.DateTimeField(null=True, blank=True)
    approval_notes = models.TextField(blank=True)
    contest = models.ForeignKey(
        Contest,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='videos',
        help_text='Optional: The contest this video is submitted to'
    )
    submission = models.OneToOneField(
        Submission,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='video',
        help_text='Optional: The submission this video is associated with'
    )
    is_standalone = models.BooleanField(
        default=False,
        help_text='Whether this is a standalone video not associated with any contest'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def increment_views(self):
        self.views += 1
        self.save(update_fields=['views'])

    def increment_likes(self):
        self.likes += 1
        self.save(update_fields=['likes'])
