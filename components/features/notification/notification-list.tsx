'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, Handshake, MessageSquare, FileText, Star, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
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

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement>(null);
  const loadingMore = useRef(false);

  const fetchNotifications = useCallback(async (pageNum: number) => {
    if (loadingMore.current && pageNum > 1) return;
    loadingMore.current = true;
    try {
      const res = await fetch(`/api/notifications?page=${pageNum}&limit=20`);
      const result: ApiResponse<Notification[]> = await res.json();
      if (result.success && result.data) {
        if (pageNum === 1) {
          setNotifications(result.data);
        } else {
          setNotifications((prev) => [...prev, ...result.data!]);
        }
        setHasMore(result.data.length === 20);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      loadingMore.current = false;
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore.current) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchNotifications(nextPage);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, page, fetchNotifications]);

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

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-slate-200 animate-pulse rounded" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} lines={1} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">알림</h1>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              모두 읽음 처리
            </Button>
          )}
        </div>
      </FadeIn>

      {notifications.length === 0 ? (
        <FadeIn delay={0.1}>
          <EmptyState
            icon={Bell}
            title="알림이 없습니다"
            description="새로운 알림이 오면 이곳에 표시됩니다."
          />
        </FadeIn>
      ) : (
        <StaggerContainer className="space-y-3">
          {notifications.map((notification) => {
            const Icon = NOTIFICATION_ICON[notification.type];
            const colorClass = NOTIFICATION_COLOR[notification.type];
            return (
              <StaggerItem key={notification.id}>
                <Card
                  className={cn(
                    'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
                    !notification.is_read && 'border-primary/30 bg-primary/[0.02]'
                  )}
                  onClick={() => markAsRead(notification.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', colorClass)}>
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          'text-sm line-clamp-1',
                          notification.is_read ? 'text-text-secondary' : 'text-text-primary font-semibold'
                        )}>
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="읽지 않음" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                        {notification.body}
                      </p>
                      <p className="mt-2 text-xs text-text-muted">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}

      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
