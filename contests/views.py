from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from .models import Contest, Submission, ContestApplication
from videos.models import Video
from .serializers import FeaturedContestSerializer, ContestSerializer, ContestDetailSerializer, SubmissionSerializer, ContestApplicationSerializer

class FeaturedVideosView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Submission.objects.filter(
            contest__status='completed',
            is_winner=True
        ).order_by('-created_at')[:6]

class FeaturedContestListView(generics.ListAPIView):
    serializer_class = FeaturedContestSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Contest.objects.filter(
            is_featured=True,
            status__in=['upcoming', 'live']
        ).order_by('-created_at')[:6]

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        # Increment view count for each contest
        for contest in self.get_queryset():
            contest.view_count += 1
            contest.save(update_fields=['view_count'])
        return response


class ContestSearchView(generics.ListAPIView):
    serializer_class = ContestSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if not query:
            return Contest.objects.filter(
                status__in=['upcoming', 'live']
            ).order_by('-created_at')

        return Contest.objects.filter(
            Q(title__icontains=query) |
            Q(brand__icontains=query) |
            Q(description__icontains=query),
            status__in=['upcoming', 'live']
        ).order_by('-created_at')


class ContestListView(generics.ListCreateAPIView):
    serializer_class = ContestSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Contest.objects.all().order_by('-created_at')
    
    def perform_create(self, serializer):
        if self.request.user.role != 'brand':
            raise PermissionDenied('Only brands can create contests')

        # Set initial status based on deadline
        deadline = serializer.validated_data.get('deadline')
        initial_status = Contest.Status.UPCOMING
        if deadline and deadline <= timezone.now():
            raise serializers.ValidationError({'deadline': 'Deadline must be in the future'})

        serializer.save(
            brand=self.request.user,
            status=initial_status
        )


class ActiveContestListView(generics.ListAPIView):
    serializer_class = ContestSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Contest.objects.filter(status='live').order_by('-created_at')


class ContestDetailView(generics.RetrieveAPIView):
    queryset = Contest.objects.all()
    serializer_class = ContestDetailSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        # Increment view count
        contest = self.get_object()
        contest.view_count += 1
        contest.save(update_fields=['view_count'])
        return response


class BrandContestListView(generics.ListAPIView):
    serializer_class = ContestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'brand':
            raise PermissionDenied('Only brands can access their contests')
        return Contest.objects.filter(brand=self.request.user).order_by('-created_at')

class ContestApplicationView(generics.CreateAPIView):
    serializer_class = ContestApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            contest = Contest.objects.get(pk=kwargs['pk'])
        except Contest.DoesNotExist:
            return Response({'detail': 'Contest not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if contest is open for applications
        if contest.status != 'live':
            return Response(
                {'detail': 'Contest is not open for applications'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user is a creator
        if request.user.role != 'creator':
            return Response(
                {'detail': 'Only creators can apply to contests'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if already applied
        if ContestApplication.objects.filter(contest=contest, creator=request.user).exists():
            return Response(
                {'detail': 'You have already applied to this contest'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the application
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            contest=contest,
            creator=request.user,
            status='pending'
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ContestApplicationStatusView(generics.RetrieveAPIView):
    serializer_class = ContestApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        contest = Contest.objects.get(pk=self.kwargs['pk'])
        try:
            return ContestApplication.objects.get(
                contest=contest,
                creator=self.request.user
            )
        except ContestApplication.DoesNotExist:
            return None

    def get(self, request, *args, **kwargs):
        application = self.get_object()
        if not application:
            return Response({'status': None})
        serializer = self.get_serializer(application)
        return Response(serializer.data)


class ContestSubmissionView(generics.CreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            # Check if user has creator role
            if request.user.role != 'creator':
                return Response(
                    {'detail': 'Only creators can submit videos to contests', 'role': request.user.role},
                    status=status.HTTP_403_FORBIDDEN
                )

            contest = Contest.objects.get(pk=kwargs['pk'])
            
            # Check if creator is approved for this contest
            try:
                application = ContestApplication.objects.get(
                    contest=contest,
                    creator=request.user
                )
                if application.status != ContestApplication.Status.APPROVED:
                    return Response(
                        {'detail': 'You must be approved to submit to this contest'},
                        status=status.HTTP_403_FORBIDDEN
                    )
            except ContestApplication.DoesNotExist:
                return Response(
                    {'detail': 'You must apply and be approved to submit to this contest'},
                    status=status.HTTP_403_FORBIDDEN
                )

            if contest.status != 'live':
                return Response(
                    {'detail': f'This contest is not accepting submissions.', 'status': contest.status},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if user has already submitted
            if Submission.objects.filter(contest=contest, creator=request.user).exists():
                return Response(
                    {'detail': 'You have already submitted to this contest'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Continue with serializer validation and saving
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Validate terms acceptance
            if not serializer.validated_data.get('terms_accepted'):
                return Response(
                    {'detail': 'You must accept the terms and conditions'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Save the submission
            submission = serializer.save(
                creator=request.user,
                contest=contest,
                status='submitted'  # Use the correct status from Submission.Status
            )
            
            # Create a video record for the submission
            try:
                video = Video.objects.create(
                    title=submission.title,
                    description=submission.description,
                    creator=submission.creator,
                    url=submission.video_file,  # Use the video file from submission
                    contest=submission.contest,
                    submission=submission,
                    category=Video.Category.OTHER  # Default category
                )
                print(f'Created video: {video.id} with URL: {video.url}')
            except Exception as e:
                print(f'Error creating video: {str(e)}')
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Contest.DoesNotExist:
            return Response(
                {'detail': 'Contest not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        

