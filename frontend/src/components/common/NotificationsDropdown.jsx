import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  BookOpen,
  Award,
  Video,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Clock,
  X,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const NotificationsDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // Silently handle error in polling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id, link, e) => {
    e?.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (link) {
        setIsOpen(false);
        navigate(link);
      }
    } catch {
      toast.error('Could not mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'achievement':
      case 'certificate':
        return <Award className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'course':
        return <BookOpen className="w-4 h-4 text-terracotta-500 shrink-0" />;
      case 'seminar':
        return <Video className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'system':
        return <ShieldCheck className="w-4 h-4 text-jade-500 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-stone-400 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-xl bg-stone-100 dark:bg-ink-850 border border-stone-200 dark:border-ink-750 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-ink-800 transition-all cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-terracotta-500 text-white rounded-full text-[10px] font-mono font-bold flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Glassmorphic Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white/95 dark:bg-ink-900/95 backdrop-blur-2xl border border-stone-200 dark:border-ink-750 shadow-2xl z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-stone-100 dark:border-ink-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif font-bold text-stone-900 dark:text-white">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-terracotta-500/15 text-terracotta-700 dark:text-terracotta-300 font-mono font-bold">
                  {unreadCount} New
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-terracotta-600 dark:text-terracotta-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-ink-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-stone-500 dark:text-stone-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
                <p className="text-xs">No notifications yet</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleMarkAsRead(item._id, item.link)}
                  className={`p-3.5 text-xs flex items-start gap-3 transition-colors cursor-pointer ${
                    !item.read
                      ? 'bg-terracotta-500/5 dark:bg-terracotta-500/10 hover:bg-terracotta-500/10'
                      : 'hover:bg-stone-50 dark:hover:bg-ink-850/60'
                  }`}
                >
                  <div className="mt-0.5">{getIcon(item.type)}</div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-semibold ${!item.read ? 'text-stone-900 dark:text-white' : 'text-stone-700 dark:text-stone-300'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-terracotta-500 shrink-0 mt-1.5"></span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
