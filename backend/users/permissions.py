from rest_framework.permissions import BasePermission

class IsAdminOrReadOnly(BasePermission):
    """
    Custom permission:
    - Anyone can read (GET requests)
    - Only admin users (is_staff=True) can create, edit, or delete
    """
    def has_permission(self, request, view):
        # Allow anyone to view (GET)
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        
        # Only admin users can POST, PUT, PATCH, DELETE
        return request.user and request.user.is_staff