from ninja import Router
from typing import List, Optional
from django.db.models import Q, Count
from ninja.errors import HttpError

from .models import ChatMessage, Notification
from .schemas import (
    ChatMessageOutSchema, SendMessageInputSchema, NotificationOutSchema
)
from apps.authentication.models import User, UserRole
from apps.authentication.security import JWTAuth

router = Router(tags=["Czat i Powiadomienia"])

def serialize_message(m: ChatMessage) -> dict:
    return {
        "id": m.id,
        "sender_id": m.sender.id,
        "sender_name": m.sender.get_full_name() or m.sender.email,
        "receiver_id": m.receiver.id,
        "receiver_name": m.receiver.get_full_name() or m.receiver.email,
        "content": m.content,
        "is_read": m.is_read,
        "created_at": m.created_at,
    }

@router.get("/messages", response=List[ChatMessageOutSchema], auth=JWTAuth())
def get_chat_history(request, other_user_id: int, limit: int = 50):
    """Pobiera historię wiadomości między zalogowanym użytkownikiem a wskazanym rozmówcą."""
    user = request.auth_user
    messages = ChatMessage.objects.filter(
        (Q(sender=user) & Q(receiver_id=other_user_id)) |
        (Q(sender_id=other_user_id) & Q(receiver=user))
    ).select_related('sender', 'receiver').order_by('created_at')[:limit]

    # Oznacz odebrane wiadomości jako przeczytane
    ChatMessage.objects.filter(sender_id=other_user_id, receiver=user, is_read=False).update(is_read=True)

    return [serialize_message(m) for m in messages]

@router.post("/messages", response=ChatMessageOutSchema, auth=JWTAuth())
def send_message_rest(request, payload: SendMessageInputSchema):
    """Wysyłanie wiadomości przez REST (fallback do WebSocket)."""
    user = request.auth_user
    receiver = User.objects.filter(id=payload.receiver_id, is_active=True).first()
    if not receiver:
        raise HttpError(404, "Nie znaleziono odbiorcy.")

    msg = ChatMessage.objects.create(
        sender=user,
        receiver=receiver,
        content=payload.content.strip()
    )

    Notification.objects.create(
        recipient=receiver,
        title=f"Nowa wiadomość od {user.get_full_name() or user.email}",
        message=payload.content.strip()[:100],
        notification_type=Notification.NotificationType.CHAT
    )

    return serialize_message(msg)

@router.get("/notifications", response=List[NotificationOutSchema], auth=JWTAuth())
def list_notifications(request):
    """Pobiera listę powiadomień wewnętrznych dla zalogowanego użytkownika."""
    notifs = Notification.objects.filter(recipient=request.auth_user).order_by('-created_at')[:30]
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "notification_type": n.notification_type,
            "is_read": n.is_read,
            "created_at": n.created_at,
        }
        for n in notifs
    ]

@router.post("/notifications/{notification_id}/read", auth=JWTAuth())
def mark_notification_read(request, notification_id: int):
    """Oznacza powiadomienie jako przeczytane."""
    notif = Notification.objects.filter(id=notification_id, recipient=request.auth_user).first()
    if not notif:
        raise HttpError(404, "Nie znaleziono powiadomienia.")

    notif.is_read = True
    notif.save(update_fields=['is_read'])
    return {"message": "Powiadomienie przeczytane."}

@router.post("/notifications/mark-all-read", auth=JWTAuth())
def mark_all_notifications_read(request):
    """Oznacza wszystkie powiadomienia użytkownika jako przeczytane."""
    Notification.objects.filter(recipient=request.auth_user, is_read=False).update(is_read=True)
    return {"message": "Wszystkie powiadomienia oznaczone jako przeczytane."}

@router.get("/unread-count", auth=JWTAuth())
def get_unread_count(request):
    """Zwraca liczbę nieprzeczytanych wiadomości i powiadomień dla zalogowanego użytkownika."""
    user = request.auth_user
    unread_messages = ChatMessage.objects.filter(receiver=user, is_read=False).count()
    unread_notifications = Notification.objects.filter(recipient=user, is_read=False).count()
    # Pobierz listę rozmówców z nieprzeczytanymi wiadomościami
    unread_senders = list(
        ChatMessage.objects.filter(receiver=user, is_read=False)
        .values('sender_id', 'sender__first_name', 'sender__last_name', 'sender__email')
        .annotate(count=Count('id'))
        .order_by('-count')
    )
    return {
        "unread_messages": unread_messages,
        "unread_notifications": unread_notifications,
        "unread_senders": [
            {
                "user_id": s['sender_id'],
                "name": f"{s['sender__first_name']} {s['sender__last_name']}".strip() or s['sender__email'],
                "count": s['count']
            }
            for s in unread_senders
        ]
    }

@router.get("/conversations", auth=JWTAuth())
def list_conversations(request):
    """Pobiera listę aktywnych rozmówców (dla dietetyków, pacjentów i admina)."""
    user = request.auth_user
    # Wszyscy rozmówcy, którzy kiedykolwiek wymienili wiadomości z użytkownikiem
    sent_to = ChatMessage.objects.filter(sender=user).values_list('receiver_id', flat=True)
    received_from = ChatMessage.objects.filter(receiver=user).values_list('sender_id', flat=True)
    partner_ids = set(list(sent_to) + list(received_from))

    conversations = []
    for pid in partner_ids:
        partner = User.objects.filter(id=pid).first()
        if not partner:
            continue
        last_msg = ChatMessage.objects.filter(
            (Q(sender=user) & Q(receiver_id=pid)) |
            (Q(sender_id=pid) & Q(receiver=user))
        ).order_by('-created_at').first()
        unread = ChatMessage.objects.filter(sender_id=pid, receiver=user, is_read=False).count()
        conversations.append({
            "partner_id": pid,
            "partner_name": partner.get_full_name() or partner.email,
            "partner_email": partner.email,
            "partner_role": partner.role,
            "partner_first_name": partner.first_name,
            "partner_last_name": partner.last_name,
            "last_message": last_msg.content[:80] if last_msg else "",
            "last_message_at": last_msg.created_at if last_msg else None,
            "unread_count": unread,
        })

    conversations.sort(key=lambda x: x['last_message_at'] or "", reverse=True)
    return conversations
