import datetime
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from ninja.security import HttpBearer

User = get_user_model()

COOKIE_NAME = 'adonis_token'

def generate_jwt_token(user) -> str:
    """Generates a secure JWT token containing user identity and role."""
    now = datetime.datetime.now(datetime.timezone.utc)
    expiration = now + datetime.timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
    
    payload = {
        'sub': str(user.id),
        'email': user.email,
        'role': user.role,
        'username': user.username,
        'iat': int(now.timestamp()),
        'exp': int(expiration.timestamp()),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_jwt_token(token: str) -> dict | None:
    """Decodes and validates a JWT token."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def get_user_from_token(token: str):
    """Retrieves the User model instance from a valid JWT token."""
    payload = decode_jwt_token(token)
    if not payload:
        return None
    try:
        user_id = payload.get('sub')
        return User.objects.select_related('patient_profile', 'assigned_dietitian').get(id=user_id)
    except User.DoesNotExist:
        return None

def extract_token_from_request(request) -> str | None:
    """
    Extracts JWT token from:
    1. Authorization: Bearer <token> header (Mobile app / REST)
    2. HttpOnly Cookie 'adonis_token' (Web browser)
    """
    # 1. Sprawdzenie nagłówka Authorization: Bearer <token>
    auth_header = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ', 1)[1].strip()
        if token:
            return token

    # 2. Sprawdzenie ciasteczka HttpOnly
    token = request.COOKIES.get(COOKIE_NAME)
    if token:
        return token

    return None

def authenticate_request(request):
    """Returns the authenticated user or None."""
    token = extract_token_from_request(request)
    if not token:
        return None
    return get_user_from_token(token)

from ninja.security.base import AuthBase

class JWTAuth(AuthBase):
    """
    Dual-layer Ninja Security class:
    Accepts both Authorization Bearer headers (Android) and HttpOnly cookies (Web).
    """
    openapi_type = "http"
    openapi_scheme = "bearer"
    openapi_bearer_format = "JWT"

    def __call__(self, request):
        user = authenticate_request(request)
        if user and user.is_active:
            request.auth_user = user
            return user
        return None


def set_auth_cookie(response, token: str, secure: bool = False):
    """Sets a secure HttpOnly cookie with SameSite=Lax for browsers."""
    max_age = settings.JWT_EXPIRATION_MINUTES * 60
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=max_age,
        httponly=True,
        secure=secure,  # True w produkcji HTTPS, False dla lokalnego localhost
        samesite='Lax',
        path='/'
    )
    return response

def clear_auth_cookie(response):
    """Deletes the authentication cookie."""
    response.delete_cookie(
        key=COOKIE_NAME,
        path='/'
    )
    return response
