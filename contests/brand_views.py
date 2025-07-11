from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Contest, Submission
from .serializers import ContestSerializer, ContestDetailSerializer, SubmissionSerializer

class IsBrandUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'brand'

class BrandContestCreateView(generics.CreateAPIView):
    serializer_class = ContestSerializer
    permission_classes = [IsBrandUser]

    def perform_create(self, serializer):
        serializer.save(brand=self.request.user)

class BrandContestListView(generics.ListAPIView):
    serializer_class = ContestDetailSerializer
    permission_classes = [IsBrandUser]

    def get_queryset(self):
        return Contest.objects.filter(brand=self.request.user).order_by('-created_at')

class BrandContestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ContestSerializer
    permission_classes = [IsBrandUser]

    def get_queryset(self):
        return Contest.objects.filter(brand=self.request.user)
    
    def perform_update(self, serializer):
        instance = serializer.instance
        if instance.status == 'completed':
            raise PermissionDenied('Cannot edit completed contests')
        serializer.save()

class BrandContestSubmissionsView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsBrandUser]

    def get_queryset(self):
        contest_id = self.kwargs.get('contest_id')
        contest = get_object_or_404(Contest, id=contest_id, brand=self.request.user)
        return Submission.objects.filter(contest=contest).order_by('-created_at')

class BrandSubmissionUpdateView(generics.UpdateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsBrandUser]

    def get_queryset(self):
        return Submission.objects.filter(contest__brand=self.request.user)

    def perform_update(self, serializer):
        submission = self.get_object()
        if submission.contest.brand != self.request.user:
            raise PermissionDenied("You don't have permission to update this submission.")

        # Get the requested status change
        new_status = serializer.validated_data.get('status')
        if new_status not in [Submission.Status.APPROVED, Submission.Status.REJECTED]:
            raise serializers.ValidationError({
                'status': 'Invalid status. Must be either approved or rejected.'
            })

        # If rejecting, require feedback
        if new_status == Submission.Status.REJECTED and not serializer.validated_data.get('feedback'):
            raise serializers.ValidationError({
                'feedback': 'Feedback is required when rejecting a submission'
            })

        serializer.save()
