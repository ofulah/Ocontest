from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    path('create/', views.CreateNotificationView.as_view(), name='create-notification'),
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('unread/', views.UnreadNotificationListView.as_view(), name='unread-notifications'),
    path('<int:notification_id>/mark-read/', views.MarkNotificationReadView.as_view(), name='mark-notification-read'),
    path('mark-all-read/', views.MarkAllNotificationsReadView.as_view(), name='mark-all-notifications-read'),
]
