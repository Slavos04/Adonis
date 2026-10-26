from ninja import Schema
from typing import Optional
from datetime import datetime

class ChatMessageOutSchema(Schema):
    id: int
    sender_id: int
    sender_name: str
    receiver_id: int
    receiver_name: str
    content: str
    is_read: bool
    created_at: datetime

class SendMessageInputSchema(Schema):
    receiver_id: int
    content: str

class NotificationOutSchema(Schema):
    id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    created_at: datetime
