## ==============================================================================
## OBSŁUGA ASYNCHRONICZNEJ KOMUNIKACJI WEBSOCKET (Django Channels & Daphne)
## Zapewnia natychmiastowe przesyłanie wiadomości czatu i powiadomień push
## z weryfikacją autoryzacji tokenem JWT w czasie rzeczywistym.
## ==============================================================================

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from apps.authentication.security import decode_jwt_token

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    """
    Asynchroniczny konsument WebSocket dla bezpośredniego czatu pacjent–dietetyk
    oraz natychmiastowych powiadomień systemowych.
    """

    async def connect(self):
        self.user = await self._authenticate_user()
        if not self.user:
            await self.close(code=4001)
            return

        self.user_group = f"user_{self.user.id}"
        await self.channel_layer.group_add(self.user_group, self.channel_name)
        await self.accept()

        # Send welcome/connection established event
        await self.send(text_data=json.dumps({
            "type": "connection_established",
            "message": f"Połączono z serwerem Adonis WebSocket jako {self.user.email}",
            "user_id": self.user.id,
            "role": self.user.role
        }))

    async def disconnect(self, close_code):
        if hasattr(self, 'user_group'):
            await self.channel_layer.group_discard(self.user_group, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return

        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        msg_type = data.get("type", "chat_message")

        if msg_type == "chat_message":
            receiver_id = data.get("receiver_id")
            content = data.get("content", "").strip()

            if not receiver_id or not content:
                await self.send(text_data=json.dumps({
                    "type": "error",
                    "error": "Brak odbiorcy lub pusta treść wiadomości."
                }))
                return

            saved_msg = await self._save_message(self.user.id, receiver_id, content)
            if not saved_msg:
                await self.send(text_data=json.dumps({
                    "type": "error",
                    "error": "Odbiorca nie istnieje."
                }))
                return

            payload = {
                "type": "chat_message",
                "message_id": saved_msg["id"],
                "sender_id": self.user.id,
                "sender_name": self.user.get_full_name() or self.user.email,
                "receiver_id": receiver_id,
                "content": content,
                "created_at": saved_msg["created_at"],
            }

            # Wysyłka do grupy odbiorcy
            target_group = f"user_{receiver_id}"
            await self.channel_layer.group_send(
                target_group,
                {
                    "type": "broadcast_message",
                    "data": payload
                }
            )

            # Potwierdzenie dla nadawcy
            await self.send(text_data=json.dumps({
                "type": "message_sent_confirmation",
                "data": payload
            }))

        elif msg_type == "typing":
            receiver_id = data.get("receiver_id")
            if receiver_id:
                target_group = f"user_{receiver_id}"
                await self.channel_layer.group_send(
                    target_group,
                    {
                        "type": "broadcast_message",
                        "data": {
                            "type": "typing",
                            "sender_id": self.user.id,
                            "sender_name": self.user.get_full_name() or self.user.email
                        }
                    }
                )

    async def broadcast_message(self, event):
        """Handler for events dispatched to the user group."""
        await self.send(text_data=json.dumps(event["data"]))

    @database_sync_to_async
    def _authenticate_user(self):
        """Extracts token from query string (?token=...) or cookie."""
        query_string = self.scope.get('query_string', b'').decode('utf-8')
        token = None
        for param in query_string.split('&'):
            if param.startswith('token='):
                token = param.split('=', 1)[1]
                break

        if not token:
            headers = dict(self.scope.get('headers', []))
            cookie_header = headers.get(b'cookie', b'').decode('utf-8')
            for cookie in cookie_header.split(';'):
                cookie = cookie.strip()
                if cookie.startswith('adonis_token='):
                    token = cookie.split('=', 1)[1]
                    break

        if not token:
            return None

        payload = decode_jwt_token(token)
        if not payload:
            return None

        user_id = payload.get('sub')
        try:
            return User.objects.get(id=user_id, is_active=True)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def _save_message(self, sender_id: int, receiver_id: int, content: str):
        from .models import ChatMessage, Notification
        receiver = User.objects.filter(id=receiver_id, is_active=True).first()
        if not receiver:
            return None

        sender = User.objects.get(id=sender_id)
        msg = ChatMessage.objects.create(
            sender=sender,
            receiver=receiver,
            content=content
        )

        Notification.objects.create(
            recipient=receiver,
            title=f"Wiadomość od {sender.get_full_name() or sender.email}",
            message=content[:100],
            notification_type=Notification.NotificationType.CHAT
        )

        return {
            "id": msg.id,
            "created_at": msg.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
