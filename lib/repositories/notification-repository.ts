import { SupabaseClient } from '@supabase/supabase-js';
import { Notification } from '@/lib/types';

export async function getNotificationsByUserId(
  supabase: SupabaseClient,
  userId: string,
  limit = 20,
  offset = 0
): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return data ?? [];
}

export async function getUnreadCount(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;

  return count ?? 0;
}

export async function markAsRead(
  supabase: SupabaseClient,
  notificationId: string,
  userId: string
): Promise<Notification> {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw error;

  return data;
}

export async function markAllAsRead(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
}

export async function createNotification(
  adminClient: SupabaseClient,
  data: {
    user_id: string;
    type: Notification['type'];
    title: string;
    body: string;
    data?: Record<string, unknown> | null;
  }
): Promise<Notification> {
  const { data: notification, error } = await adminClient
    .from('notifications')
    .insert({
      ...data,
      is_read: false,
    })
    .select('*')
    .single();

  if (error) throw error;

  return notification;
}
