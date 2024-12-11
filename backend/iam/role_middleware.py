
from django.http import JsonResponse

def role_required(required_role):
    def decorator(view_func):
        def _wrapped_view(request, *args, **kwargs):
            if request.user.role != required_role:
                return JsonResponse({"error": "You do not have permission to access this resource."}, status=403)
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator