from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from .models import Notification
from .serializers import NotificationSerializer
from .services import mark_notification_as_read, mark_all_notifications_as_read
from contests.models import Contest

User = get_user_model()

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.notifications.all().order_by('-created_at')

class UnreadNotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.notifications.filter(is_read=False).order_by('-created_at')

class MarkNotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, notification_id):
        try:
            notification = mark_notification_as_read(notification_id, request.user)
            return Response(NotificationSerializer(notification).data)
        except Notification.DoesNotExist:
            return Response(
                {'error': 'Notification not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class CreateNotificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            notification_type = request.data.get('type')
            title = request.data.get('title')
            message = request.data.get('message')
            link = request.data.get('link')
            recipient_role = request.data.get('recipientRole')

            # Get contest ID from link if it's a contest notification
            contest_id = None
            if link and '/contests/' in link:
                contest_id = link.split('/contests/')[-1].split('/')[0]

            # Create notification for all users with the specified role
            notifications = []
            recipients = User.objects.filter(role=recipient_role, is_active=True)

            for recipient in recipients:
                notification_data = {
                    'recipient': recipient,
                    'notification_type': notification_type,
                    'title': title,
                    'message': message
                }

                # If this is a contest notification, link it to the contest
                if contest_id:
                    try:
                        contest = Contest.objects.get(id=contest_id)
                        notification_data.update({
                            'content_type': ContentType.objects.get_for_model(Contest),
                            'object_id': contest.id
                        })
                    except Contest.DoesNotExist:
                        pass

                notification = Notification.objects.create(**notification_data)
                notifications.append(notification)

            return Response({
                'status': 'success',
                'count': len(notifications)
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class MarkAllNotificationsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        mark_all_notifications_as_read(request.user)
        return Response({'status': 'success'})
