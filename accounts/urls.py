from django.urls import path
from . import views
from .views import (PasswordResetRequestView, PasswordResetConfirmView, 
    CheckProfileCompletionView)

app_name = 'accounts'

print('\nDebug: Accounts URLs loaded')

urlpatterns = [
    # Auth endpoints
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/register/brand/', views.BrandRegisterView.as_view(), name='register-brand'),
    path('auth/verify-email/<str:uidb64>/<str:token>/', views.VerifyEmailView.as_view(), name='verify-email'),
    path('auth/resend-verification/', views.ResendVerificationEmailView.as_view(), name='resend-verification'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('me/', views.CurrentUserView.as_view(), name='current-user'),
    path('auth/creator-profile/', views.CreatorProfileViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'}), name='creator-profile'),
    path('auth/brand-profile/', views.BrandProfileViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'}), name='brand-profile'),
    # Creator dashboard endpoints
    path('creators/stats/', views.CreatorStatsView.as_view(), name='creator-stats'),
    path('creators/videos/', views.CreatorVideosView.as_view(), name='creator-videos'),
    path('creators/submissions/', views.CreatorSubmissionsView.as_view(), name='creator-submissions'),
    path('creators/earnings/', views.CreatorEarningsView.as_view(), name='creator-earnings'),
    path('creator-dashboard/', views.CreatorDashboardView.as_view(), name='creator-dashboard'),
    # Public endpoints
    path('public/creator/<int:id>/', views.PublicCreatorProfileView.as_view(), name='public-creator-profile'),
    path('public/brand/<int:id>/', views.PublicBrandProfileView.as_view(), name='public-brand-profile'),
    
    # Password reset endpoints
    path('auth/password/reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('auth/password/reset/confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Profile completion check
    path('creator/profile/check-completion/', CheckProfileCompletionView.as_view(), name='check-profile-completion')
]
