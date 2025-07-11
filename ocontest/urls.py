"""
URL configuration for ocontest project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import django
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.admin.views.decorators import staff_member_required
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from .stats import StatsView

# Debug URLs
if settings.DEBUG:
    import debug_toolbar
    import sys
    import platform
    
    def debug_view(request):
        from django.http import JsonResponse
        return JsonResponse({
            'python_version': sys.version,
            'django_version': django.get_version(),
            'system': platform.system(),
            'release': platform.release(),
            'debug': settings.DEBUG,
            'installed_apps': settings.INSTALLED_APPS,
        })
    
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
        path('debug/', debug_view, name='debug-info'),
    ]
else:
    urlpatterns = []

# Main URL patterns
urlpatterns += [
    path('', views.api_root, name='api-root'),
    path('admin/statistics/', staff_member_required(StatsView.as_view()), name='admin_stats'),
    path('admin/', admin.site.urls),
    # Authentication URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('social-auth/', include('social_django.urls', namespace='social')),  # Social auth before other URLs
    
    # API URLs
    path('api/accounts/', include('accounts.urls', namespace='accounts')),
    path('api/', include('contests.urls')),
    path('api/notifications/', include('notifications.urls', namespace='notifications')),
    path('api/videos/', include('videos.urls', namespace='videos')),
    path('api/', include('contact.urls')),
]

# Serve media files in development
if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
