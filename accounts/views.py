import logging

logger = logging.getLogger(__name__)

from rest_framework import generics, permissions, status, viewsets, parsers
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.db.models import Sum, Count
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.shortcuts import redirect, get_object_or_404
from .serializers import (UserSerializer, CreatorProfileSerializer, BrandProfileSerializer,
    BrandSerializer, PublicCreatorProfileSerializer, PublicBrandProfileSerializer)
from .models import User, CreatorProfile, BrandProfile
from django.contrib.auth.forms import SetPasswordForm
from contests.models import Contest, Submission
from contests.serializers import ContestSerializer, SubmissionSerializer

class BrandRegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = BrandSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create inactive user that requires email verification
            user = serializer.save(is_active=False)
            
            # Generate verification token
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            
            # Create verification URL
            verification_url = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
            
            # Prepare email
            context = {
                'user': user,
                'verification_url': verification_url,
            }
            email_html = render_to_string('registration/verification_email.html', context)
            
            # Send verification email
            send_mail(
                subject='Verify your OContest Brand account',
                message='Please verify your email address to complete registration.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=email_html,
                fail_silently=False,
            )
            
            return Response({
                'message': 'Brand registration successful! Please check your email to verify your account.',
                'user': UserSerializer(user).data,
                'require_verification': True
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'errors': {'detail': str(e)}
            }, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create inactive user that requires email verification
            user = serializer.save(is_active=False)
            
            # Generate verification token
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            
            # Create verification URL
            verification_url = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
            
            # Prepare email
            context = {
                'user': user,
                'verification_url': verification_url,
            }
            email_html = render_to_string('registration/verification_email.html', context)
            
            # Send verification email
            send_mail(
                subject='Verify your OContest account',
                message='Please verify your email address to complete registration.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=email_html,
                fail_silently=False,
            )
            
            return Response({
                'message': 'Registration successful! Please check your email to verify your account.',
                'user': UserSerializer(user).data,
                'require_verification': True
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'errors': {'detail': str(e)}
            }, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, uidb64, token):
        try:
            # Decode the user ID
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            # Check the token is valid
            if default_token_generator.check_token(user, token):
                # Activate the user and mark as verified
                user.is_active = True
                user.is_verified = True
                user.save()
                
                # Log the user in
                login(request, user)
                
                # Redirect to frontend dashboard with success message
                return redirect(f"{settings.FRONTEND_URL}/dashboard?verified=true")
            else:
                return redirect(f"{settings.FRONTEND_URL}/verify-email/error?message=invalid")
                
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return redirect(f"{settings.FRONTEND_URL}/verify-email/error?message=invalid")

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({
                'error': 'Please provide both email and password'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)

        if user is not None:
            if not user.is_active:
                # Check if this is an unverified account
                return Response({
                    'error': 'Please verify your email first',
                    'require_verification': True
                }, status=status.HTTP_403_FORBIDDEN)

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            tokens = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }

            # Get user data
            user_data = UserSerializer(user).data

            return Response({
                'tokens': tokens,
                'user': user_data
            })
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

class ResendVerificationEmailView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({
                'error': 'Email is required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(email=email)
            
            # Check if user is already verified
            if user.is_active:
                return Response({
                    'message': 'Your email is already verified. Please log in.'
                }, status=status.HTTP_200_OK)
                
            # Generate verification token
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            
            # Create verification URL
            verification_url = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
            
            # Prepare email
            context = {
                'user': user,
                'verification_url': verification_url,
            }
            email_html = render_to_string('registration/verification_email.html', context)
            
            # Send verification email
            send_mail(
                subject='Verify your OContest account',
                message='Please verify your email address to complete registration.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=email_html,
                fail_silently=False,
            )
            
            return Response({
                'message': 'Verification email has been resent. Please check your inbox.'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            # Don't reveal that the email doesn't exist for security reasons
            return Response({
                'message': 'If your email exists in our system, a verification link has been sent.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        logout(request)
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)

class CreatorProfileViewSet(viewsets.GenericViewSet,
                          generics.RetrieveUpdateAPIView):
    serializer_class = CreatorProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ['get', 'put', 'patch']
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def get_object(self):
        try:
            return CreatorProfile.objects.get(user=self.request.user)
        except CreatorProfile.DoesNotExist:
            raise NotFound('Creator profile not found')

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        
        # Debug received data
        print("DEBUG: Received data:", dict(data))
        
        # Handle shipping address if provided as a nested object
        if 'shipping_address' in data and data['shipping_address']:
            shipping_data = data.pop('shipping_address')
            if isinstance(shipping_data, str):
                try:
                    import json
                    shipping_data = json.loads(shipping_data)
                except (TypeError, json.JSONDecodeError):
                    shipping_data = {}
            
            # Map the nested address fields to the model fields
            address_mapping = {
                'shipping_address_line1': shipping_data.get('line1', ''),
                'shipping_address_line2': shipping_data.get('line2', ''),
                'shipping_city': shipping_data.get('city', ''),
                'shipping_state': shipping_data.get('state', ''),
                'shipping_postal_code': shipping_data.get('postal', ''),
                'shipping_country': shipping_data.get('country', '')
            }
            data.update(address_mapping)
        
        # Handle file uploads
        if 'profile_picture' in request.FILES:
            data['profile_picture'] = request.FILES['profile_picture']
        if 'banner_image' in request.FILES:
            data['banner_image'] = request.FILES['banner_image']
        
        # Handle JSON fields that might come as strings
        if 'social_media_links' in data and isinstance(data['social_media_links'], str):
            try:
                import json
                data['social_media_links'] = json.loads(data['social_media_links'])
            except (TypeError, json.JSONDecodeError):
                pass
        
        # Handle user data if it's a string (from FormData)
        if 'user' in data and isinstance(data['user'], str):
            try:
                import json
                data['user'] = json.loads(data['user'])
            except (TypeError, json.JSONDecodeError):
                pass
        
        # Validate phone number if SMS notifications are enabled
        receive_sms = data.get('receive_sms_notifications')
        if receive_sms and (receive_sms == 'true' or receive_sms is True):
            phone_number = data.get('phone_number') or instance.user.phone_number
            if not phone_number:
                return Response(
                    {'phone_number': ['Phone number is required for SMS notifications']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Basic phone number validation
            import re
            if not re.match(r'^\+?[0-9]{10,15}$', phone_number):
                return Response(
                    {'phone_number': ['Please enter a valid phone number in international format (e.g., +1234567890)']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update user's phone number if provided
            if 'phone_number' in data:
                user = instance.user
                user.phone_number = phone_number
                user.save()
        
        # Use the processed data for the serializer
        serializer = self.get_serializer(instance, data=data, partial=partial)
        
        # Check if serializer is valid and print errors if not
        if not serializer.is_valid():
            print("DEBUG: Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

class CreatorStatsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        # Check if user is a creator
        if not hasattr(request.user, 'creator_profile'):
            return Response({'error': 'User is not a creator'}, status=status.HTTP_403_FORBIDDEN)

        # Get all videos (submissions) by the creator
        submissions = Submission.objects.filter(creator=request.user)
        
        # Calculate stats
        stats = {
            'totalVideos': submissions.count(),
            'totalSubmissions': submissions.filter(contest__isnull=False).count(),
            'totalViews': submissions.aggregate(Sum('view_count'))['view_count__sum'] or 0,
            'contestWins': submissions.filter(status='winner').count(),
        }
        
        return Response(stats)


class CreatorVideosView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Submission.objects.filter(
            creator=self.request.user,
            contest__isnull=True
        ).order_by('-created_at')


class CreatorSubmissionsView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Submission.objects.filter(
            creator=self.request.user,
            contest__isnull=False
        ).order_by('-created_at')


class CurrentUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        user_data = UserSerializer(user).data

        # Add profile data based on user role
        if user.role == 'creator':
            try:
                profile = CreatorProfile.objects.get(user=user)
                profile_data = CreatorProfileSerializer(profile).data
            except CreatorProfile.DoesNotExist:
                profile_data = None
        elif user.role == 'brand':
            try:
                profile = BrandProfile.objects.get(user=user)
                profile_data = BrandProfileSerializer(profile).data
            except BrandProfile.DoesNotExist:
                profile_data = None
        else:
            profile_data = None

        response_data = {
            **user_data,
            'profile': profile_data
        }
        return Response(response_data)

class BrandProfileViewSet(viewsets.GenericViewSet,
                       generics.RetrieveUpdateAPIView):
    serializer_class = BrandProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ['get', 'put', 'patch']
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def get_object(self):
        try:
            return BrandProfile.objects.get(user=self.request.user)
        except BrandProfile.DoesNotExist:
            raise NotFound('Brand profile not found')

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Handle file uploads
        profile_picture = request.FILES.get('profile_picture')
        if profile_picture:
            instance.profile_picture = profile_picture
            instance.save()

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

class PublicCreatorProfileView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PublicCreatorProfileSerializer
    lookup_field = 'user_id'
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        return CreatorProfile.objects.select_related('user').all()

class PublicBrandProfileView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PublicBrandProfileSerializer
    lookup_field = 'user_id'
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        return BrandProfile.objects.select_related('user').all()

class CreatorEarningsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        # Calculate total earnings from winning submissions
        total_earnings = Submission.objects.filter(
            creator=request.user,
            status='winner'
        ).aggregate(total=Sum('prize_amount'))['total'] or 0

        # Calculate pending payouts
        pending_payouts = Submission.objects.filter(
            creator=request.user,
            status='winner',
            is_paid_out=False
        ).aggregate(total=Sum('prize_amount'))['total'] or 0

        return Response({
            'total_earnings': total_earnings,
            'pending_payouts': pending_payouts,
            'currency': 'USD'  # You can make this dynamic based on user's preference
        })

class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal that the user doesn't exist for security reasons
            return Response(
                {'message': 'If an account exists with this email, a password reset link has been sent'},
                status=status.HTTP_200_OK
            )
        
        # Generate password reset token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        # Create reset URL
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
        
        # Prepare email
        context = {
            'user': user,
            'reset_url': reset_url,
        }
        
        email_html = render_to_string('registration/password_reset_email.html', context)
        email_text = f"Please click the following link to reset your password: {reset_url}"
        
        try:
            send_mail(
                'Reset your OContest password',
                email_text,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                html_message=email_html,
                fail_silently=False,
            )
            return Response(
                {'message': 'Password reset email sent'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': 'Failed to send password reset email'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            if not default_token_generator.check_token(user, token):
                return Response(
                    {'error': 'Invalid or expired token'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            form = SetPasswordForm(user=user, data=request.data)
            if form.is_valid():
                form.save()
                return Response(
                    {'message': 'Password has been reset successfully'}, 
                    status=status.HTTP_200_OK
                )
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {'error': 'Invalid user or token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


# -------------------------------------------------------------
# Creator Dashboard Aggregated View
# -------------------------------------------------------------
class CreatorDashboardView(APIView):
    """Return aggregated data for Creator dashboard in a single request."""
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        if not hasattr(request.user, 'creator_profile'):
            return Response({'error': 'User is not a creator'}, status=status.HTTP_403_FORBIDDEN)

        # Profile data
        profile_serializer = CreatorProfileSerializer(request.user.creator_profile)

        # Stats
        submissions = Submission.objects.filter(creator=request.user)
        stats = {
            'totalVideos': submissions.count(),
            'totalSubmissions': submissions.filter(contest__isnull=False).count(),
            'totalViews': submissions.aggregate(Sum('view_count'))['view_count__sum'] or 0,
            'contestWins': submissions.filter(status='winner').count(),
        }

        # Earnings
        total_earnings = submissions.filter(status='winner').aggregate(total=Sum('prize_amount'))['total'] or 0
        pending_payouts = submissions.filter(status='winner', is_paid_out=False).aggregate(total=Sum('prize_amount'))['total'] or 0
        earnings = {
            'total_earnings': total_earnings,
            'pending_payouts': pending_payouts,
            'currency': 'USD'
        }

        # Contest lists (placeholder): You can enhance this as needed.
        running_contests = []
        applied_contests = []
        ended_contests = []

        return Response({
            'profile': profile_serializer.data,
            'stats': stats,
            'earnings': earnings,
            'running_contests': running_contests,
            'applied_contests': applied_contests,
            'ended_contests': ended_contests,
        })


class CheckProfileCompletionView(APIView):
    """
    Check if a creator's profile is complete with all required fields.
    """
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request):
        # Debug logging
        logger.info(f"CheckProfileCompletionView called by user {request.user.id} - {request.user.email}")
        logger.info(f"Request headers: {request.headers}")
        logger.info(f"Authentication details: {request.user.is_authenticated}")
        
        try:
            # Enhanced authentication check
            if not request.user.is_authenticated:
                logger.warning("Unauthenticated user tried to access profile completion check")
                return Response(
                    {
                        'error': 'Authentication required',
                        'detail': 'You must be logged in to check profile completion'
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Get user details for debugging
            user_id = getattr(request.user, 'id', 'Unknown')
            user_email = getattr(request.user, 'email', 'Unknown')
            logger.info(f"Checking profile completion for user: {user_id} - {user_email}")
            
            # Get or create creator profile for the current user with better error handling
            try:
                creator_profile, created = CreatorProfile.objects.get_or_create(
                    user=request.user,
                    defaults={
                        'bio': '',
                        'portfolio_url': '',
                        'shipping_address_line1': '',
                        'shipping_city': '',
                        'shipping_country': '',
                        'phone': '',
                        'gender': ''
                    }
                )
                logger.info(f"Profile {'created' if created else 'found'} for user {user_id}")
            except Exception as profile_error:
                logger.error(f"Error getting/creating profile: {str(profile_error)}", exc_info=True)
                return Response(
                    {
                        'error': 'Profile error',
                        'detail': f'Could not retrieve or create profile: {str(profile_error)}'
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            if created:
                logger.info(f"Created new creator profile for user: {request.user.id}")
            else:
                logger.info(f"Found existing creator profile: {creator_profile.id}")
            
            # Define required fields that must be filled out
            required_fields = [
                {'field': 'bio', 'label': 'Bio'},
                {'field': 'portfolio_url', 'label': 'Portfolio URL'},
                {'field': 'shipping_address_line1', 'label': 'Shipping Address'},
                {'field': 'shipping_city', 'label': 'City'},
                {'field': 'shipping_country', 'label': 'Country'},
                {'field': 'phone_number', 'label': 'Phone Number', 'source': 'user'},
                {'field': 'gender', 'label': 'Gender', 'source': 'user'}
            ]
            
            # Check which required fields are missing
            missing_fields = []
            field_values = {}
            
            for field_info in required_fields:
                field = field_info['field']
                source = field_info.get('source', 'profile')  # 'profile' or 'user'
                try:
                    if source == 'user':
                        value = getattr(request.user, field, None)
                    else:
                        value = getattr(creator_profile, field, None)
                    field_values[f"{source}.{field}"] = value
                    
                    # Special rule: phone number only required if user has opted for SMS
                    if field == 'phone_number':
                        if creator_profile.receive_sms_notifications and not value:
                            missing_fields.append(field_info['label'])
                    elif value in [None, '', []]:
                        missing_fields.append(field_info['label'])
                except Exception as e:
                    logger.error(f"Error checking field {field} from {source}: {str(e)}")
                    missing_fields.append(field_info['label'])
            
            completion_percentage = 100 if len(missing_fields) == 0 else int((1 - (len(missing_fields) / len(required_fields))) * 100)
            
            # Prepare response with enhanced completion status and missing fields
            response_data = {
                'is_complete': len(missing_fields) == 0,
                'missing_fields': missing_fields,
                'completion_percentage': completion_percentage,
                'created': created,
                'user_id': request.user.id,
                'profile_id': creator_profile.id,
                'field_values': field_values,
                'status': 'success',
                'message': 'Profile check completed successfully'
            }
            
            # Log the response for debugging
            logger.info(f"Profile check complete. Complete: {len(missing_fields) == 0}, Missing: {missing_fields}")
            
            # Return the response with explicit 200 status
            return Response(response_data, status=status.HTTP_200_OK)
                
        except Exception as e:
            logger.error(f'Error checking profile completion: {str(e)}', exc_info=True)
            return Response(
                {
                    'error': 'An error occurred while checking profile completion',
                    'detail': str(e)
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
