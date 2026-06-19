import React, { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { ContactMessage } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchMessages = () => {
    setLoading(true);
    api
      .get('/site/messages/admin/all')
      .then((res) => setMessages(res.data.messages || []))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.patch(`/site/messages/${id}/read`);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/site/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.isRead) markRead(id);
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (loading) return <LoadingSpinner full size="lg" />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Messages</h1>
        <p className="text-sm text-navy-300">
          {messages.length} total · {unreadCount} unread
        </p>
      </div>

      <div className="space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`admin-card overflow-hidden transition-shadow ${
              !m.isRead ? 'ring-1 ring-navy-300' : ''
            }`}
          >
            <div
              className="p-4 flex items-center gap-3 cursor-pointer"
              onClick={() => toggleExpand(m.id)}
            >
              <div className="w-9 h-9 rounded-xl bg-navy-900/60 flex items-center justify-center shrink-0">
                {m.isRead ? (
                  <MailOpen className="w-4 h-4 text-navy-400" />
                ) : (
                  <Mail className="w-4 h-4 text-navy-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm truncate ${m.isRead ? 'text-navy-300 font-medium' : 'text-white font-semibold'}`}>
                    {m.name}
                  </p>
                  {!m.isRead && <span className="w-2 h-2 rounded-full bg-navy-300 shrink-0" />}
                </div>
                <p className="text-xs text-navy-400 line-clamp-1">{m.message}</p>
              </div>
              <p className="text-xs text-navy-400 shrink-0 hidden sm:block">
                {new Date(m.createdAt).toLocaleDateString()}
              </p>
              <ChevronDown className={`w-4 h-4 text-navy-400 shrink-0 transition-transform ${expanded === m.id ? 'rotate-180' : ''}`} />
            </div>

            {expanded === m.id && (
              <div className="border-t border-white/10 px-4 pb-4 pt-3 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 text-sm">
                  <div>
                    <p className="text-xs text-navy-400 mb-0.5">Email</p>
                    <a href={`mailto:${m.email}`} className="text-white hover:underline">{m.email}</a>
                  </div>
                  {m.phone && (
                    <div>
                      <p className="text-xs text-navy-400 mb-0.5">Phone</p>
                      <a href={`tel:${m.phone}`} className="text-white hover:underline">{m.phone}</a>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-navy-400 mb-0.5">Received</p>
                    <p className="text-white">{new Date(m.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-navy-400 mb-1">Message</p>
                  <p className="text-sm text-white leading-relaxed bg-surface rounded-xl p-3">{m.message}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${m.email}?subject=Re: Your inquiry at Mdani Games`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-300 text-navy-950 text-xs font-semibold hover:bg-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Reply via Email
                  </a>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-red-400 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="admin-card text-center py-14 text-navy-400 text-sm">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
