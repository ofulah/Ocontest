from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from contests.models import Contest, Submission
from .services import SMSNotificationService

sms_service = SMSNotificationService()

@receiver(post_save, sender=Contest)
def notify_new_contest(sender, instance, created, **kwargs):
    """
    Send SMS notifications to all eligible creators when a new contest is created
    """
    if created and instance.status == 'ACTIVE':
        from users.models import User
        # Get all creators with phone numbers
        creators = User.objects.filter(
            role='CREATOR',
            phone_number__isnull=False,
            notification_preferences__sms_enabled=True
        )
        for creator in creators:
            sms_service.notify_new_contest(creator, instance)

@receiver(post_save, sender=Submission)
def notify_submission_status(sender, instance, **kwargs):
    """
    Send SMS notifications when a submission status changes
    """
    if not hasattr(instance, 'creator') or not instance.creator.phone_number:
        return

    if instance.status == 'SELECTED':
        sms_service.notify_submission_selected(instance.creator, instance.contest)
    elif instance.status == 'REJECTED':
        sms_service.notify_submission_rejected(instance.creator, instance.contest)
    elif instance.status == 'WINNER':
        sms_service.notify_contest_won(instance.creator, instance.contest)
