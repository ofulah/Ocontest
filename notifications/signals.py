from django.db.models.signals import post_save
from django.dispatch import receiver
from contests.models import Contest, Submission
from .services import create_notification
from accounts.models import User
from .sms_service import send_sms_notification
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Contest)
def handle_contest_notifications(sender, instance, created, **kwargs):
    # Only send notifications when a contest is set to 'live' status
    if not created and instance.status == 'live':
        # Check if this is a status change to 'live'
        try:
            # Get the previous state of the instance if available
            old_instance = Contest.objects.get(pk=instance.pk)
            if old_instance.status != 'live':  # Only notify if status changed to 'live'
                # Notify all creators about the now-public contest
                creators = User.objects.filter(role='creator', is_active=True)
                for creator in creators:
                    # Create in-app notification
                    create_notification(
                        recipient=creator,
                        notification_type='new_contest',
                        title='New Contest Available',
                        message=f'A new contest "{instance.title}" is now available with a prize of ${instance.prize}',
                        related_object=instance
                    )
                    
                    # Send SMS notification if enabled and phone number is provided
                    try:
                        # Check if creator has SMS notifications enabled and has a phone number
                        if hasattr(creator, 'creator_profile') and creator.creator_profile.receive_sms_notifications and creator.phone_number:
                            sms_message = f"OContest: New contest '{instance.title}' available with ${instance.prize} prize. Log in to apply!"
                            send_sms_notification(creator.phone_number, sms_message)
                            logger.info(f"SMS notification sent to {creator.email} at {creator.phone_number}")
                    except Exception as e:
                        logger.error(f"Failed to send SMS notification to {creator.email}: {str(e)}")
        except Contest.DoesNotExist:
            # This shouldn't happen, but just in case
            pass
    elif instance.status == 'completed' and instance.winner:
        # Notify winner
        winner = instance.winner.creator
        create_notification(
            recipient=winner,
            notification_type='winner_chosen',
            title='Congratulations! You Won!',
            message=f'Your submission has been chosen as the winner for the contest "{instance.title}"',
            related_object=instance
        )
        
        # Send SMS notification to winner if enabled
        try:
            if hasattr(winner, 'creator_profile') and winner.creator_profile.receive_sms_notifications and winner.phone_number:
                sms_message = f"Congratulations! You won the contest '{instance.title}' with a prize of ${instance.prize}!"
                send_sms_notification(winner.phone_number, sms_message)
                logger.info(f"Winner SMS notification sent to {winner.email} at {winner.phone_number}")
        except Exception as e:
            logger.error(f"Failed to send winner SMS notification to {winner.email}: {str(e)}")
        
        # Notify other participants
        submissions = instance.submissions.exclude(creator=instance.winner.creator)
        for submission in submissions:
            create_notification(
                recipient=submission.creator,
                notification_type='contest_closed',
                title='Contest Results',
                message=f'The contest "{instance.title}" has ended. Thank you for participating!',
                related_object=instance
            )

@receiver(post_save, sender=Submission)
def handle_submission_notifications(sender, instance, created, **kwargs):
    if created:
        # Notify brand about new submission
        create_notification(
            recipient=instance.contest.brand,
            notification_type='new_submission',
            title='New Contest Submission',
            message=f'A new submission has been received for your contest "{instance.contest.title}"',
            related_object=instance
        )
    elif instance.feedback:  # If feedback was added/updated
        # Notify creator about feedback
        create_notification(
            recipient=instance.creator,
            notification_type='submission_feedback',
            title='New Feedback Received',
            message=f'You have received feedback on your submission for "{instance.contest.title}"',
            related_object=instance
        )
