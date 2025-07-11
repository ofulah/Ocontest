from rest_framework import generics, permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.utils import timezone
from .models import Video
from .serializers import VideoSerializer, VideoUploadSerializer

class VideoListView(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Video.objects.all()
        
        # Filter based on approval status only
        if not self.request.user.is_staff:
            queryset = queryset.filter(approval_status=Video.ApprovalStatus.APPROVED)
        
        # Order by most recent first
        return queryset.order_by('-created_at')

class VideoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and managing videos.
    """
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Non-staff users can only see approved videos
        if not self.request.user.is_staff:
            queryset = queryset.filter(approval_status=Video.ApprovalStatus.APPROVED)
            
        # Filter by creator if specified
        creator_id = self.request.query_params.get('creator_id')
        if creator_id:
            queryset = queryset.filter(creator_id=creator_id)
            
        # Filter by contest if specified
        contest_id = self.request.query_params.get('contest_id')
        if contest_id:
            queryset = queryset.filter(contest_id=contest_id)
            
        # Filter by standalone status
        is_standalone = self.request.query_params.get('is_standalone')
        if is_standalone is not None:
            queryset = queryset.filter(is_standalone=is_standalone.lower() in ('true', '1'))
            
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        # Set the creator to the current user
        serializer.save(creator=self.request.user)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        video = self.get_object()
        video.increment_likes()
        return Response({'likes': video.likes})
    
    @action(detail=True, methods=['get'])
    def view(self, request, pk=None):
        video = self.get_object()
        video.increment_views()
        serializer = self.get_serializer(video)
        return Response(serializer.data)


class VideoUploadViewSet(viewsets.GenericViewSet):
    """
    ViewSet specifically for handling video uploads.
    """
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VideoUploadSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create the video instance
        video = serializer.save(
            creator=request.user,
            approval_status=Video.ApprovalStatus.PENDING
        )
        
        # Prepare response
        headers = self.get_success_headers(serializer.data)
        return Response(
            VideoSerializer(video, context=self.get_serializer_context()).data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class CreatorVideosView(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        creator_id = self.kwargs['creator_id']
        queryset = Video.objects.filter(creator_id=creator_id)
        if not self.request.user.is_staff:
            queryset = queryset.filter(approval_status=Video.ApprovalStatus.APPROVED)
        return queryset.order_by('-created_at')

class FeaturedVideosView(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Video.objects.filter(is_featured=True)
        if not self.request.user.is_staff:
            queryset = queryset.filter(approval_status=Video.ApprovalStatus.APPROVED)
        return queryset[:6]
