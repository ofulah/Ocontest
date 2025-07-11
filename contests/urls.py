from django.urls import path
from . import views, dashboard_views, brand_views, brand_dashboard_views
from .views_brand_products import BrandProductListView

app_name = 'contests'

urlpatterns = [
    # Public contest endpoints
    path('contests/', views.ContestListView.as_view(), name='contest-list'),
    path('contests/featured/', views.FeaturedContestListView.as_view(), name='featured-contests'),
    path('contests/active/', views.ActiveContestListView.as_view(), name='active-contests'),
    path('contests/search/', views.ContestSearchView.as_view(), name='contest-search'),
    path('contests/<int:pk>/', views.ContestDetailView.as_view(), name='contest-detail'),
    path('contests/<int:pk>/submit/', views.ContestSubmissionView.as_view(), name='contest-submit'),
    path('contests/<int:pk>/apply/', views.ContestApplicationView.as_view(), name='contest-apply'),
    path('contests/<int:pk>/application-status/', views.ContestApplicationStatusView.as_view(), name='contest-application-status'),
    
    # Brand-specific endpoints
    path('brand/contests/', brand_views.BrandContestListView.as_view(), name='brand-contest-list'),
    path('brand/contests/create/', brand_views.BrandContestCreateView.as_view(), name='brand-contest-create'),
    path('brand/contests/<int:pk>/', brand_views.BrandContestDetailView.as_view(), name='brand-contest-detail'),
    path('brand/contests/<int:contest_id>/submissions/', brand_views.BrandContestSubmissionsView.as_view(), name='brand-contest-submissions'),
    path('brand/submissions/<int:pk>/', brand_views.BrandSubmissionUpdateView.as_view(), name='brand-submission-update'),
    path('brand/contests/<int:contest_id>/applications/', brand_dashboard_views.ContestApplicationListView.as_view(), name='brand-contest-applications'),
    path('brand/applications/<int:application_id>/', brand_dashboard_views.ContestApplicationUpdateView.as_view(), name='brand-application-update'),
    
    # Creator dashboard endpoints
    path('creator/dashboard/', dashboard_views.CreatorDashboardView.as_view(), name='creator-dashboard'),
    path('creators/videos/', dashboard_views.CreatorVideosView.as_view(), name='creator-videos'),
    path('creators/submissions/', dashboard_views.CreatorSubmissionsView.as_view(), name='creator-submissions'),
    path('creators/earnings/', dashboard_views.CreatorEarningsView.as_view(), name='creator-earnings'),
    
    # Other endpoints
    path('videos/featured/', views.FeaturedVideosView.as_view(), name='featured-videos'),
    
    # Brand products endpoint
    path('brands/<int:brand_id>/products/', BrandProductListView.as_view(), name='brand-products'),
]
