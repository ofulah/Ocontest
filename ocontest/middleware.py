class RequestLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print(f'\nDebug: Incoming request: {request.method} {request.path}')
        print(f'Debug: Headers: {dict(request.headers)}')
        response = self.get_response(request)
        print(f'Debug: Response status: {response.status_code}')
        return response
