import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatApi, authApi } from '../api/client';
import { Send, MessageSquare, CheckCheck, User, Bell, RefreshCw } from 'lucide-react';
import { autoCapitalizeSentences } from '../utils/textUtils';

// Format timestamp nicely
function formatTime(ts) {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  } catch (_) {
    return String(ts).slice(11, 16) || ts;
  }
}

function formatRelative(ts) {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'teraz';
    if (diffMins < 60) return `${diffMins}m temu`;
    const diffH = Math.floor(diffMins / 60);
    if (diffH < 24) return `${diffH}h temu`;
    return d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
  } catch (_) { return ''; }
}

const ROLE_LABELS = { dietitian: 'Dietetyk', patient: 'Pacjent', admin: 'Admin' };

export function ChatWidget({ defaultTargetUser }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputContent, setInputContent] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const [targetUser, setTargetUser] = useState(defaultTargetUser || null);
  const [conversations, setConversations] = useState([]);  // existing conversations
  const [allContacts, setAllContacts] = useState([]);       // all available contacts
  const [notifications, setNotifications] = useState([]);
  const [activePanel, setActivePanel] = useState('chat'); // 'chat' | 'notifications'
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  }, []);

  // ── Load contacts and conversations ───────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      // Load all available contacts by role
      let contacts = [];
      if (user.role === 'patient') {
        contacts = await authApi.getDietitians();
      } else {
        contacts = await authApi.getPatients();
      }
      setAllContacts(contacts);

      // Load existing conversations (with unread counts)
      const convs = await chatApi.getConversations();
      setConversations(convs);

      // If no target yet, pick first with unread or first in conversations or first contact
      if (!targetUser) {
        const withUnread = convs.find(c => c.unread_count > 0);
        if (withUnread) {
          const contact = contacts.find(c => c.id === withUnread.partner_id) || {
            id: withUnread.partner_id,
            first_name: withUnread.partner_first_name || withUnread.partner_name,
            last_name: withUnread.partner_last_name || '',
            email: withUnread.partner_email,
            role: withUnread.partner_role,
          };
          setTargetUser(contact);
        } else if (convs.length > 0) {
          const firstConv = convs[0];
          const contact = contacts.find(c => c.id === firstConv.partner_id) || {
            id: firstConv.partner_id,
            first_name: firstConv.partner_first_name || firstConv.partner_name,
            last_name: firstConv.partner_last_name || '',
            email: firstConv.partner_email,
            role: firstConv.partner_role,
          };
          setTargetUser(contact);
        } else if (contacts.length > 0) {
          setTargetUser(contacts[0]);
        }
      }

      // Load notifications
      const notifs = await chatApi.getNotifications();
      setNotifications(notifs);
    } catch (_) {}
  }, [user, targetUser]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Auto-refresh conversations every 20 sec ───────────────────────────────
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const convs = await chatApi.getConversations();
        setConversations(convs);
      } catch (_) {}
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // ── Load history when targetUser changes ──────────────────────────────────
  useEffect(() => {
    if (targetUser) {
      loadHistory(targetUser.id);
    }
  }, [targetUser]);

  // ── WebSocket ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('adonis_token') || '';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/chat/?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'chat_message') {
          setMessages(prev => {
            if (payload.id && prev.some(m => m.id === payload.id)) return prev;
            return [...prev, payload];
          });
          scrollToBottom();
          // Refresh conversations to update unread count and new senders
          chatApi.getConversations().then(setConversations).catch(() => {});
        }
      } catch (_) {}
    };

    return () => ws.close();
  }, [user, scrollToBottom]);

  async function loadHistory(otherId) {
    try {
      const history = await chatApi.getHistory(otherId);
      setMessages(history);
      scrollToBottom();
      // Mark as read: refresh conversation list
      const convs = await chatApi.getConversations();
      setConversations(convs);
    } catch (_) {}
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!inputContent.trim() || !targetUser) return;
    const content = inputContent.trim();
    setInputContent('');

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        receiver_id: targetUser.id,
        content,
      }));
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender_id: user.id,
        sender_name: user.first_name || user.email,
        receiver_id: targetUser.id,
        content,
        created_at: new Date().toISOString(),
      }]);
      scrollToBottom();
    } else {
      try {
        const saved = await chatApi.sendMessage(targetUser.id, content);
        setMessages(prev => [...prev, saved]);
        scrollToBottom();
      } catch (err) {
        alert(`Błąd wysyłania: ${err.message}`);
      }
    }
  }

  async function handleMarkNotifRead(notifId) {
    try {
      await chatApi.markNotificationRead(notifId);
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    } catch (_) {}
  }

  async function handleMarkAllRead() {
    try {
      await chatApi.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (_) {}
  }

  // ── Sidebar: merge conversations + all contacts ───────────────────────────
  const contactsMap = new Map();

  // 1. Dodajemy wszystkie istniejące konwersacje (w tym Admin, Dietetyk, Pacjent)
  conversations.forEach(conv => {
    contactsMap.set(conv.partner_id, {
      id: conv.partner_id,
      name: conv.partner_name || conv.partner_email || `Użytkownik #${conv.partner_id}`,
      email: conv.partner_email || '',
      role: conv.partner_role || 'user',
      first_name: conv.partner_first_name || (conv.partner_name ? conv.partner_name.split(' ')[0] : ''),
      last_name: conv.partner_last_name || (conv.partner_name ? conv.partner_name.split(' ').slice(1).join(' ') : ''),
      lastMessage: conv.last_message || '',
      lastAt: conv.last_message_at || null,
      unread: conv.unread_count || 0,
    });
  });

  // 2. Uzupełniamy o kontakty z bazy (np. lista przypisanych dietetyków/pacjentów)
  allContacts.forEach(contact => {
    const existing = contactsMap.get(contact.id);
    if (existing) {
      if (!existing.email && contact.email) existing.email = contact.email;
      if (!existing.role && contact.role) existing.role = contact.role;
      if (!existing.first_name && contact.first_name) existing.first_name = contact.first_name;
      if (!existing.last_name && contact.last_name) existing.last_name = contact.last_name;
    } else {
      contactsMap.set(contact.id, {
        id: contact.id,
        name: contact.first_name ? `${contact.first_name} ${contact.last_name || ''}`.trim() : (contact.email || `Użytkownik #${contact.id}`),
        email: contact.email || '',
        role: contact.role || 'user',
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        lastMessage: '',
        lastAt: null,
        unread: 0,
      });
    }
  });

  const sidebarItems = Array.from(contactsMap.values());
  sidebarItems.sort((a, b) => {
    if (a.lastAt && b.lastAt) return b.lastAt > a.lastAt ? 1 : -1;
    if (a.lastAt) return -1;
    if (b.lastAt) return 1;
    return a.name.localeCompare(b.name);
  });

  const unreadNotifs = notifications.filter(n => !n.is_read).length;

  return (
    <div className="glass-panel" style={{ display: 'flex', height: '680px', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
      
      {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
      <div style={{
        width: '260px', flexShrink: 0, borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)',
      }}>
        {/* Sidebar header */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => setActivePanel('chat')}
              style={{
                flex: 1, padding: '0.45rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: activePanel === 'chat' ? 'var(--accent-emerald-glow)' : 'transparent',
                color: activePanel === 'chat' ? 'var(--accent-emerald)' : 'var(--text-muted)',
                fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                transition: 'all 0.2s'
              }}
            >
              <MessageSquare size={14} /> Czat
            </button>
            <button
              onClick={() => setActivePanel('notifications')}
              style={{
                flex: 1, padding: '0.45rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: activePanel === 'notifications' ? 'var(--accent-emerald-glow)' : 'transparent',
                color: activePanel === 'notifications' ? 'var(--accent-emerald)' : 'var(--text-muted)',
                fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                position: 'relative', transition: 'all 0.2s'
              }}
            >
              <Bell size={14} />
              Powiad.
              {unreadNotifs > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '4px',
                  minWidth: '16px', height: '16px', borderRadius: '8px',
                  background: 'var(--accent-rose)', color: '#fff',
                  fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px'
                }}>
                  {unreadNotifs}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activePanel === 'chat' ? (
            <>
              {sidebarItems.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                  Brak dostępnych kontaktów
                </div>
              ) : sidebarItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    const contact = allContacts.find(c => c.id === item.id) || {
                      id: item.id,
                      first_name: item.first_name || item.name.split(' ')[0],
                      last_name: item.last_name || item.name.split(' ').slice(1).join(' '),
                      email: item.email,
                      role: item.role,
                    };
                    setTargetUser(contact);
                  }}
                  style={{
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: targetUser?.id === item.id ? 'var(--accent-emerald-glow)' : 'transparent',
                    transition: 'background 0.15s',
                    display: 'flex', alignItems: 'center', gap: '0.65rem',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { if (targetUser?.id !== item.id) e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { if (targetUser?.id !== item.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, var(--accent-emerald), var(--accent-indigo))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                    position: 'relative',
                  }}>
                    {item.name[0]?.toUpperCase()}
                    {/* online dot placeholder */}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: item.unread > 0 ? 700 : 600, fontSize: '0.83rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }}>
                        {item.name}
                      </span>
                      {item.lastAt && <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', flexShrink: 0 }}>{formatRelative(item.lastAt)}</span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.1rem' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                        {item.lastMessage || <span style={{ color: 'var(--text-dim)' }}>{ROLE_LABELS[item.role]}</span>}
                      </span>
                      {item.unread > 0 && (
                        <span style={{
                          minWidth: '18px', height: '18px', borderRadius: '9px',
                          background: 'var(--accent-rose)', color: '#fff',
                          fontSize: '0.65rem', fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '0 4px', flexShrink: 0, marginLeft: '4px',
                        }}>
                          {item.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            /* Notifications panel */
            <>
              <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Powiadomienia</span>
                {unreadNotifs > 0 && (
                  <button onClick={handleMarkAllRead} style={{ fontSize: '0.7rem', background: 'none', border: 'none', color: 'var(--accent-emerald)', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Odznacz wszystkie
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.82rem' }}>Brak powiadomień</div>
              ) : notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && handleMarkNotifRead(n.id)}
                  style={{
                    padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-subtle)',
                    cursor: !n.is_read ? 'pointer' : 'default',
                    background: n.is_read ? 'transparent' : 'rgba(16,185,129,0.05)',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <div style={{ fontWeight: n.is_read ? 500 : 700, fontSize: '0.8rem', color: n.is_read ? 'var(--text-muted)' : 'var(--text-main)', flex: 1 }}>
                      {n.title}
                    </div>
                    {!n.is_read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-emerald)', flexShrink: 0, marginTop: '4px' }} />}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.4 }}>{n.message}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>{formatRelative(n.created_at)}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ── RIGHT: CHAT AREA ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Chat header */}
        <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {targetUser ? (
              <>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-indigo))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', fontWeight: 800, color: '#fff',
                }}>
                  {((targetUser.first_name || targetUser.name || targetUser.email || '?')[0] || '?').toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {targetUser.first_name ? `${targetUser.first_name} ${targetUser.last_name || ''}`.trim() : (targetUser.name || targetUser.email)}
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                    {ROLE_LABELS[targetUser.role] || targetUser.role}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <MessageSquare size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                Wybierz rozmówcę z listy
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.73rem' }}>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: wsConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)',
              display: 'inline-block',
            }} />
            <span style={{ color: 'var(--text-muted)' }}>{wsConnected ? 'WebSocket' : 'HTTP fallback'}</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {!targetUser ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-dim)' }}>
              <MessageSquare size={40} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.9rem' }}>Wybierz kontakt z listy po lewej stronie</p>
            </div>
          ) : messages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-dim)' }}>
              <MessageSquare size={40} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.88rem' }}>Brak wiadomości. Rozpocznij rozmowę!</p>
            </div>
          ) : messages.map((msg, idx) => {
            const isMe = msg.sender_id === user.id;
            return (
              <div
                key={msg.id || idx}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '72%',
                }}
              >
                {!isMe && (
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '0.2rem', paddingLeft: '0.5rem' }}>
                    {msg.sender_name}
                  </div>
                )}
                <div style={{
                  background: isMe ? 'linear-gradient(135deg, var(--accent-emerald), #059669)' : 'var(--bg-card-hover)',
                  color: isMe ? '#fff' : 'var(--text-main)',
                  padding: '0.7rem 1rem',
                  borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: isMe ? 'none' : '1px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}>
                  {msg.content}
                  <div style={{ fontSize: '0.62rem', textAlign: 'right', marginTop: '0.25rem', opacity: 0.7 }}>
                    {formatTime(msg.created_at)}
                    {isMe && msg.is_read && <CheckCheck size={10} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          style={{ display: 'flex', gap: '0.5rem', padding: '1rem 1.25rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}
        >
          <input
            className="form-input"
            type="text"
            placeholder={targetUser ? `Napisz do ${targetUser.first_name || targetUser.email}...` : 'Wybierz rozmówcę...'}
            value={inputContent}
            disabled={!targetUser}
            autoCapitalize="sentences"
            onChange={e => setInputContent(autoCapitalizeSentences(e.target.value))}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            disabled={!targetUser || !inputContent.trim()}
            className="btn btn-primary"
            style={{ padding: '0 1.1rem', flexShrink: 0 }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
