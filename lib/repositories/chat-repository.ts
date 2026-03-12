import { SupabaseClient } from '@supabase/supabase-js';
import { ChatRoom, Message } from '@/lib/types';

const CHAT_ROOM_SELECT = '*, match:matches(*, campaign:campaigns(*, brand:brands(*)), creator:creators(*, profile:profiles(*)))';

export async function getChatRoomsByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<ChatRoom[]> {
  const { data, error } = await supabase
    .from('chat_rooms')
    .select(CHAT_ROOM_SELECT)
    .or(`creator_id.eq.${userId},brand_id.eq.${userId}`)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (error) throw error;

  return data ?? [];
}

export async function getChatRoomById(
  supabase: SupabaseClient,
  roomId: string
): Promise<ChatRoom | null> {
  const { data, error } = await supabase
    .from('chat_rooms')
    .select(CHAT_ROOM_SELECT)
    .eq('id', roomId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function getChatRoomByMatchId(
  supabase: SupabaseClient,
  matchId: string
): Promise<ChatRoom | null> {
  const { data, error } = await supabase
    .from('chat_rooms')
    .select(CHAT_ROOM_SELECT)
    .eq('match_id', matchId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function createChatRoom(
  supabase: SupabaseClient,
  data: {
    match_id: string;
    creator_id: string;
    brand_id: string;
  }
): Promise<ChatRoom> {
  const { data: room, error } = await supabase
    .from('chat_rooms')
    .insert(data)
    .select(CHAT_ROOM_SELECT)
    .single();

  if (error) throw error;

  return room;
}

export async function getMessages(
  supabase: SupabaseClient,
  roomId: string,
  limit = 50,
  offset = 0
): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return data ?? [];
}

export async function createMessage(
  supabase: SupabaseClient,
  data: {
    room_id: string;
    sender_id: string;
    content: string;
    message_type: Message['message_type'];
    file_url?: string | null;
  }
): Promise<Message> {
  const { data: message, error } = await supabase
    .from('messages')
    .insert(data)
    .select('*')
    .single();

  if (error) throw error;

  return message;
}

export async function markMessagesAsRead(
  supabase: SupabaseClient,
  roomId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('room_id', roomId)
    .neq('sender_id', userId)
    .eq('is_read', false);

  if (error) throw error;
}

export async function updateLastMessageAt(
  supabase: SupabaseClient,
  roomId: string
): Promise<void> {
  const { error } = await supabase
    .from('chat_rooms')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', roomId);

  if (error) throw error;
}
