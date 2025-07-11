from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Sum
from django.core.exceptions import ObjectDoesNotExist
from .models import Contest, Submission
from .serializers import ContestSerializer, SubmissionSerializer
from accounts.serializers import CreatorProfileSerializer

class CreatorDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if user.role != 'creator':
                return Response({'error': 'Only creators can access this dashboard'}, status=403)

            # Get creator profile
            profile = user.creator_profile
            profile_data = CreatorProfileSerializer(profile).data

            # Get running contests (contests that are live and user has submitted to)
            running_submissions = Submission.objects.filter(
                creator=user,
                contest__status='live'
            ).select_related('contest')
            running_contests_data = [
                {
                    'contest': ContestSerializer(submission.contest).data,
                    'submission': SubmissionSerializer(submission).data
                }
                for submission in running_submissions
            ]

            # Get contests user has applied to
            applied_submissions = Submission.objects.filter(
                creator=user
            ).exclude(
                contest__status='live'
            ).select_related('contest')
            applied_contests_data = [
                {
                    'contest': ContestSerializer(submission.contest).data,
                    'submission': SubmissionSerializer(submission).data
                }
                for submission in applied_submissions
            ]

            # Get ended contests (where user submitted and contest is completed)
            ended_submissions = Submission.objects.filter(
                creator=user,
                contest__status__in=['completed', 'closed']
            ).select_related('contest')
            ended_contests_data = [
                {
                    'contest': ContestSerializer(submission.contest).data,
                    'submission': SubmissionSerializer(submission).data,
                    'result': submission.status  # Show if they won, were finalist, etc.
                }
                for submission in ended_submissions
            ]

            # Get all submissions by the creator
            submissions = Submission.objects.filter(
                creator=user
            ).order_by('-created_at')
            
            # Get all standalone videos by the creator
            from videos.models import Video
            from videos.serializers import VideoSerializer
            
            standalone_videos = Video.objects.filter(
                creator=user,
                is_standalone=True
            ).order_by('-created_at')
            
            # Combine submission data and standalone video data
            submissions_data = SubmissionSerializer(submissions, many=True).data
            standalone_videos_data = VideoSerializer(standalone_videos, many=True).data
            
            # Combine all videos data
            videos_data = submissions_data + standalone_videos_data

            # Aggregate stats
            stats = {
                'total_submissions': submissions.count(),
                'total_videos': submissions.count() + standalone_videos.count(),
                'contests_won': submissions.filter(status='won').count(),
                'active_submissions': running_submissions.count(),
                'finalist_entries': submissions.filter(status='finalist').count(),
            }

            return Response({
                'profile': profile_data,
                'stats': stats,
                'running_contests': running_contests_data,
                'applied_contests': applied_contests_data,
                'ended_contests': ended_contests_data,
                'videos': videos_data  # Changed from uploaded_videos to videos to match frontend expectation
            })
        except Exception as e:
            import traceback
            print('Error in CreatorDashboardView:', str(e))
            print('Traceback:', traceback.format_exc())
            return Response({'error': str(e)}, status=500)


class CreatorVideosView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if user.role != 'creator':
                return Response({'error': 'Only creators can access this endpoint'}, status=403)

            videos = Submission.objects.filter(creator=user).order_by('-created_at')
            videos_data = SubmissionSerializer(videos, many=True).data

            return Response({
                'videos': videos_data
            })
        except Exception as e:
            import traceback
            print('Error in CreatorVideosView:', str(e))
            print('Traceback:', traceback.format_exc())
            return Response({'error': str(e)}, status=500)


class CreatorSubmissionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if user.role != 'creator':
                return Response({'error': 'Only creators can access this endpoint'}, status=403)

            submissions = Submission.objects.filter(creator=user)\
                .select_related('contest')\
                .order_by('-created_at')

            submissions_data = [{
                'submission': SubmissionSerializer(submission).data,
                'contest': ContestSerializer(submission.contest).data
            } for submission in submissions]

            return Response({
                'submissions': submissions_data
            })
        except Exception as e:
            import traceback
            print('Error in CreatorSubmissionsView:', str(e))
            print('Traceback:', traceback.format_exc())
            return Response({'error': str(e)}, status=500)


class CreatorEarningsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if not user or not hasattr(user, 'role'):
                return Response({'error': 'Invalid user'}, status=status.HTTP_401_UNAUTHORIZED)

            if user.role != 'creator':
                return Response({'error': 'Only creators can access this endpoint'}, status=status.HTTP_403_FORBIDDEN)

            try:
                profile = user.creator_profile
                if not profile:
                    return Response({'error': 'Creator profile not found'}, status=status.HTTP_404_NOT_FOUND)
            except ObjectDoesNotExist:
                return Response({'error': 'Creator profile not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                print('Error getting creator profile:', str(e))
                return Response({'error': 'Error accessing creator profile'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            try:
                # Get won submissions with contest info
                won_submissions = Submission.objects.filter(
                    creator=user,
                    status='won'
                ).select_related('contest')

                # Initialize total earnings
                total_earnings = Decimal('0.00')
                earnings_data = []

                # Process each submission
                for submission in won_submissions:
                    try:
                        if submission.contest and hasattr(submission.contest, 'prize'):
                            prize = submission.contest.prize or Decimal('0.00')
                            total_earnings += prize
                            earnings_data.append({
                                'contest_name': submission.contest.title or 'Unknown Contest',
                                'prize': float(prize),
                                'date_won': submission.updated_at.isoformat() if submission.updated_at else None
                            })
                    except Exception as e:
                        print(f'Error processing submission {submission.id}:', str(e))
                        continue

                # Update profile total earnings if different
                try:
                    if profile.total_earnings != total_earnings:
                        profile.total_earnings = total_earnings
                        profile.save(update_fields=['total_earnings'])
                except Exception as e:
                    print('Error updating profile earnings:', str(e))

                return Response({
                    'total_earnings': float(total_earnings),
                    'earnings_breakdown': earnings_data
                })

            except Exception as e:
                print('Error calculating earnings:', str(e))
                # Fallback to profile's stored earnings
                return Response({
                    'total_earnings': float(profile.total_earnings or Decimal('0.00')),
                    'earnings_breakdown': []
                })

        except Exception as e:
            import traceback
            print('Error in CreatorEarningsView:', str(e))
            print('Traceback:', traceback.format_exc())
            return Response(
                {'error': 'An unexpected error occurred'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
