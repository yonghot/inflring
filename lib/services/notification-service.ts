import { SupabaseClient } from '@supabase/supabase-js';
import { Notification, NotificationType } from '@/lib/types';
import {
  getNotificationsByUserId,
  getUnreadCount as getUnreadCountRepo,
  markAsRead as markAsReadRepo,
  markAllAsRead as markAllAsReadRepo,
  createNotification as createNotificationRepo,
} from '@/lib/repositories/notification-repository';
import { createAdminClient } from '@/lib/supabase/admin';

export async function getMyNotifications(
  supabase: SupabaseClient,
  userId: string,
  page: number,
  limit: number
): Promise<{ notifications: Notification[]; total: number }> {
  const offset = (page - 1) * limit;
  const notifications = await getNotificationsByUserId(supabase, userId, limit, offset);
  const total = await getUnreadCountRepo(supabase, userId);

  return { notifications, total };
}

export async function getUnreadCount(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  return getUnreadCountRepo(supabase, userId);
}

export async function markAsRead(
  supabase: SupabaseClient,
  notificationId: string,
  userId: string
): Promise<Notification> {
  return markAsReadRepo(supabase, notificationId, userId);
}

export async function markAllAsRead(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  return markAllAsReadRepo(supabase, userId);
}

export async function createNotification(data: {
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
}): Promise<Notification> {
  const adminClient = createAdminClient();

  return createNotificationRepo(adminClient, data);
}
