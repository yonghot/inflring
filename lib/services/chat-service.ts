import { SupabaseClient } from '@supabase/supabase-js';
import { ChatRoom, Message, MessageType } from '@/lib/types';
import {
  getChatRoomsByUserId,
  getChatRoomById,
  getChatRoomByMatchId,
  createChatRoom,
  getMessages as getMessagesRepo,
  createMessage as createMessageRepo,
  markMessagesAsRead as markMessagesAsReadRepo,
  updateLastMessageAt,
} from '@/lib/repositories/chat-repository';
import { getMatchById } from '@/lib/repositories/match-repository';
import {
  AuthorizationError,
  ValidationError,
} from '@/lib/utils/api-helpers';

export async function getMyRooms(
  supabase: SupabaseClient,
  userId: string
): Promise<ChatRoom[]> {
  return getChatRoomsByUserId(supabase, userId);
}

export async function getOrCreateRoom(
  supabase: SupabaseClient,
  userId: string,
  matchId: string
): Promise<ChatRoom> {
  const match = await getMatchById(supabase, matchId);

  if (!match) {
    throw new ValidationError('매칭을 찾을 수 없습니다');
  }

  const creatorProfileId = match.creator?.profile_id;
  const brandProfileId = match.campaign?.brand?.profile_id;

  if (userId !== creatorProfileId && userId !== brandProfileId) {
    throw new AuthorizationError('해당 매칭의 당사자만 채팅방을 생성할 수 있습니다');
  }

  const existing = await getChatRoomByMatchId(supabase, matchId);

  if (existing) {
    return existing;
  }

  if (!creatorProfileId || !brandProfileId) {
    throw new ValidationError('매칭 정보가 불완전합니다');
  }

  return createChatRoom(supabase, {
    match_id: matchId,
    creator_id: creatorProfileId,
    brand_id: brandProfileId,
  });
}

function isRoomParty(room: ChatRoom, userId: string): boolean {
  return room.creator_id === userId || room.brand_id === userId;
}

export async function getMessages(
  supabase: SupabaseClient,
  userId: string,
  roomId: string,
  page: number,
  limit: number
): Promise<Message[]> {
  const room = await getChatRoomById(supabase, roomId);

  if (!room) {
    throw new ValidationError('채팅방을 찾을 수 없습니다');
  }

  if (!isRoomParty(room, userId)) {
    throw new AuthorizationError('해당 채팅방의 참여자만 메시지를 조회할 수 있습니다');
  }

  const offset = (page - 1) * limit;

  return getMessagesRepo(supabase, roomId, limit, offset);
}

export async function sendMessage(
  supabase: SupabaseClient,
  userId: string,
  roomId: string,
  content: string,
  messageType: MessageType = 'text'
): Promise<Message> {
  const room = await getChatRoomById(supabase, roomId);

  if (!room) {
    throw new ValidationError('채팅방을 찾을 수 없습니다');
  }

  if (!isRoomParty(room, userId)) {
    throw new AuthorizationError('해당 채팅방의 참여자만 메시지를 보낼 수 있습니다');
  }

  const message = await createMessageRepo(supabase, {
    room_id: roomId,
    sender_id: userId,
    content,
    message_type: messageType,
  });

  await updateLastMessageAt(supabase, roomId);

  return message;
}

export async function markAsRead(
  supabase: SupabaseClient,
  userId: string,
  roomId: string
): Promise<void> {
  const room = await getChatRoomById(supabase, roomId);

  if (!room) {
    throw new ValidationError('채팅방을 찾을 수 없습니다');
  }

  if (!isRoomParty(room, userId)) {
    throw new AuthorizationError('해당 채팅방의 참여자만 읽음 처리를 할 수 있습니다');
  }

  return markMessagesAsReadRepo(supabase, roomId, userId);
}
