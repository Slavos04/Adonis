"""
ASGI config for Adonis project.
Exposes ASGI application supporting both HTTP and WebSockets.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'adonis_backend.settings')
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import apps.chat.routing

django_http_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_http_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            apps.chat.routing.websocket_urlpatterns
        )
    ),
})
