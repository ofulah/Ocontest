from django.contrib.contenttypes.models import ContentType
from .models import Notification

def create_notification(recipient, notification_type, title, message, related_object=None):
    """
    Create a new notification for a user.
    
    Args:
        recipient: User object - the user who will receive the notification
        notification_type: str - type of notification (from Notification.NotificationType)
        title: str - notification title
        message: str - notification message
        related_object: Model instance - optional related object (Contest, Submission, etc.)
    """
    notification = Notification(
        recipient=recipient,
        notification_type=notification_type,
        title=title,
        message=message
    )

    if related_object:
        notification.content_type = ContentType.objects.get_for_model(related_object)
        notification.object_id = related_object.id

    notification.save()
    return notification

def get_unread_notifications(user):
    """Get all unread notifications for a user."""
    return user.notifications.filter(is_read=False).order_by('-created_at')

def mark_notification_as_read(notification_id, user):
    """Mark a specific notification as read."""
    notification = Notification.objects.get(id=notification_id, recipient=user)
    notification.is_read = True
    notification.save()
    return notification

def mark_all_notifications_as_read(user):
    """Mark all notifications as read for a user."""
    user.notifications.filter(is_read=False).update(is_read=True)
