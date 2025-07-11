from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Contest(models.Model):
    class Status(models.TextChoices):
        UPCOMING = 'upcoming', _('Upcoming')
        LIVE = 'live', _('Live')
        CLOSED = 'closed', _('Closed')
        JUDGING = 'judging', _('Judging')
        COMPLETED = 'completed', _('Completed')

    title = models.CharField(max_length=200)
    description = models.TextField()
    brand = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_contests',
        limit_choices_to={'role': 'brand'}
    )
    prize = models.DecimalField(max_digits=10, decimal_places=2)
    deadline = models.DateTimeField()
    brief = models.TextField(help_text='Brief description of what you want')
    inspiration = models.TextField(blank=True, help_text='Examples or inspiration for creators')
    rules = models.TextField(blank=True, help_text='Contest rules and guidelines')
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.UPCOMING
    )
    region = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50, default='English')
    max_entries = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_featured = models.BooleanField(default=False)
    thumbnail = models.ImageField(upload_to='contest_thumbnails/', blank=True)
    view_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

class Submission(models.Model):
    class Status(models.TextChoices):
        PENDING_APPROVAL = 'pending_approval', _('Pending Approval')
        APPROVED = 'approved', _('Approved')
        REJECTED = 'rejected', _('Rejected')
        UNDER_REVIEW = 'under_review', _('Under Review')
        FINALIST = 'finalist', _('Finalist')
        WON = 'won', _('Won')
        NOT_SELECTED = 'not_selected', _('Not Selected')

    contest = models.ForeignKey(
        Contest,
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='submissions',
        limit_choices_to={'role': 'creator'}
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    video_file = models.FileField(upload_to='contest_videos/')
    thumbnail = models.ImageField(upload_to='submission_thumbnails/', blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING_APPROVAL
    )
    feedback = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    view_count = models.PositiveIntegerField(default=0)
    terms_accepted = models.BooleanField(default=False)
    terms_accepted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} - {self.creator.email}'


class ContestApplication(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        APPROVED = 'approved', _('Approved')
        REJECTED = 'rejected', _('Rejected')

    contest = models.ForeignKey(
        Contest,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='contest_applications',
        limit_choices_to={'role': 'creator'}
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    terms_accepted = models.BooleanField(default=False)
    notes = models.TextField(blank=True, help_text='Creator notes or admin feedback')
    
    # Shipping Information
    shipping_address_line1 = models.CharField(max_length=255, blank=True, null=True)
    shipping_city = models.CharField(max_length=100, blank=True, null=True)
    shipping_state = models.CharField(max_length=100, blank=True, null=True)
    shipping_postal = models.CharField(max_length=20, blank=True, null=True)
    shipping_country = models.CharField(max_length=100, blank=True, null=True)
    
    # Product Information
    product = models.ForeignKey(
        'accounts.Product',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='contest_applications'
    )
    full_name = models.CharField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['contest', 'creator']
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.creator.email} - {self.contest.title} ({self.status})'

    def save(self, *args, **kwargs):
        # Check if this is an existing instance being updated
        if self.pk:
            old_instance = ContestApplication.objects.get(pk=self.pk)
            
            # Check if status is being changed to APPROVED
            if self.status == self.Status.APPROVED and old_instance.status != self.Status.APPROVED:
                if self.product:
                    # Reduce the product stock by 1
                    try:
                        if self.product.stock_quantity > 0:
                            self.product.stock_quantity -= 1
                            self.product.save()
                        else:
                            # If no stock is available, don't allow approval
                            self.status = old_instance.status
                            raise ValueError("Cannot approve application: Product is out of stock")
                    except Exception as e:
                        # Log the error and re-raise
                        import logging
                        logger = logging.getLogger(__name__)
                        logger.error(f"Error updating product stock: {str(e)}")
                        raise
        
        super().save(*args, **kwargs)
