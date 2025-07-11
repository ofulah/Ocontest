from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Contest, ContestApplication
from .serializers import ContestApplicationSerializer

class ContestApplicationListView(generics.ListAPIView):
    serializer_class = ContestApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        contest_id = self.kwargs['contest_id']
        user = self.request.user

        # Check if user is the brand owner of the contest
        contest = Contest.objects.get(pk=contest_id)
        if contest.brand != user:
            raise PermissionDenied('Only the contest owner can view applications')

        return ContestApplication.objects.filter(
            contest_id=contest_id
        ).select_related('creator').order_by('-created_at')


class ContestApplicationUpdateView(generics.UpdateAPIView):
    serializer_class = ContestApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'application_id'

    def get_queryset(self):
        return ContestApplication.objects.all()

    def get_object(self):
        application = super().get_object()
        
        # Check if user is the brand owner of the contest
        if application.contest.brand != self.request.user:
            raise PermissionDenied('Only the contest owner can update applications')
        
        return application

    def update(self, request, *args, **kwargs):
        application = self.get_object()
        
        # Only allow updating status and notes
        status = request.data.get('status')
        notes = request.data.get('notes', '')

        if status not in [s[0] for s in ContestApplication.Status.choices]:
            return Response(
                {'status': 'Invalid status value'},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = status
        application.notes = notes
        application.save()

        serializer = self.get_serializer(application)
        return Response(serializer.data)
