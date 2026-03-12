'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Handshake, MessageSquare, FileText, Star, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatTimeAgo } from '@/lib/utils';
import type { ApiResponse, Notification, NotificationType } from '@/lib/types';

const NOTIFICATION_ICON: Record<NotificationType, typeof Bell> = {
  match: Handshake,
  message: MessageSquare,
  contract: FileText,
  review: Star,
  system: Info,
};

const NOTIFICATION_COLOR: Record<NotificationType, string> = {
  match: 'text-primary bg-primary/10',
  message: 'text-blue-600 bg-blue-50',
  contract: 'text-amber-600 bg-amber-50',
  review: 'text-yellow-500 bg-yellow-50',
  system: 'text-slate-500 bg-slate-100',
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?limit=10');
      const result: ApiResponse<Notification[]> = await res.json();
      if (result.success && result.data) {
        setNotifications(result.data);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch {
      // silently fail
    }
  }

  async function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await fetch('/api/notifications/read-all', { method: 'PATCH' });
    } catch {
      // silently fail
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-lg p-2 text-text-secondary hover:bg-slate-100 hover:text-text-primary transition-colors"
        aria-label={`알림 ${unreadCount > 0 ? `(${unreadCount}개 읽지 않음)` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell size={20} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-border bg-white shadow-xl z-50"
            role="menu"
            aria-label="알림 패널"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-text-primary">알림</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
                >
                  모두 읽음 처리
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell size={24} className="mx-auto mb-2 text-text-muted" aria-hidden="true" />
                  <p className="text-sm text-text-secondary">알림이 없습니다</p>
                </div>
              ) : (
                <ul role="list">
                  {notifications.map((notification) => {
                    const Icon = NOTIFICATION_ICON[notification.type];
                    const colorClass = NOTIFICATION_COLOR[notification.type];
                    return (
                      <li key={notification.id}>
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className={cn(
                            'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50',
                            !notification.is_read && 'bg-primary/5'
                          )}
                          role="menuitem"
                        >
                          <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', colorClass)}>
                            <Icon size={14} aria-hidden="true" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={cn(
                              'text-sm line-clamp-1',
                              notification.is_read ? 'text-text-secondary' : 'text-text-primary font-medium'
                            )}>
                              {notification.title}
                            </p>
                            <p className="mt-0.5 text-xs text-text-muted line-clamp-2">
                              {notification.body}
                            </p>
                            <p className="mt-1 text-[11px] text-text-muted">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="읽지 않음" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
