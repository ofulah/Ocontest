from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'videos'

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'videos', views.VideoViewSet, basename='video')
router.register(r'upload', views.VideoUploadViewSet, basename='video-upload')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    
    # Legacy endpoints (keep for backward compatibility)
    path('featured/', views.FeaturedVideosView.as_view(), name='featured-videos'),
    path('creator/<int:creator_id>/', views.CreatorVideosView.as_view(), name='creator-videos'),
]
