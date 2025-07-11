from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request, format=None):
    """
    API root view that provides links to the main API endpoints.
    """
    return Response({
        'auth': {
            'register': reverse('accounts:register', request=request, format=format),
            'login': reverse('accounts:login', request=request, format=format),
            'logout': reverse('accounts:logout', request=request, format=format),
            'profile': reverse('accounts:profile', request=request, format=format),
        },
        'creators': {
            'stats': reverse('accounts:creator-stats', request=request, format=format),
            'videos': reverse('accounts:creator-videos', request=request, format=format),
            'submissions': reverse('accounts:creator-submissions', request=request, format=format),
            'earnings': reverse('accounts:creator-earnings', request=request, format=format),
        },
        'contests': {
            'list': reverse('contests:contest-list', request=request, format=format),
            'featured': reverse('contests:featured-contests', request=request, format=format),
            'active': reverse('contests:active-contests', request=request, format=format),
            'search': reverse('contests:contest-search', request=request, format=format),
        }
    })
