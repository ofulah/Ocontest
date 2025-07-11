from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

User = get_user_model()

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        NEW_CONTEST = 'new_contest', 'New Contest Available'
        CONTEST_CLOSED = 'contest_closed', 'Contest Closed'
        WINNER_CHOSEN = 'winner_chosen', 'Winner Chosen'
        NEW_SUBMISSION = 'new_submission', 'New Submission'
        SUBMISSION_FEEDBACK = 'submission_feedback', 'Submission Feedback'
        APPLICATION_APPROVED = 'application_approved', 'Contest Application Approved'
        APPLICATION_REJECTED = 'application_rejected', 'Contest Application Rejected'

    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(
        max_length=50,
        choices=NotificationType.choices
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # Generic foreign key to the related object (Contest, Submission, etc.)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    related_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', '-created_at']),
            models.Index(fields=['content_type', 'object_id']),
        ]

    def __str__(self):
        return f"{self.notification_type} for {self.recipient.email}"
