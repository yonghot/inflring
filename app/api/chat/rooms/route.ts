import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getMyRooms, getOrCreateRoom } from '@/lib/services/chat-service';
import {
  successResponse,
  errorResponse,
  getAuthenticatedUser,
  handleServiceError,
} from '@/lib/utils/api-helpers';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    const rooms = await getMyRooms(supabase, profile.id);

    return successResponse(rooms, { total: rooms.length });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    const body = await request.json();
    const matchId = body.matchId;

    if (!matchId || typeof matchId !== 'string') {
      return errorResponse('유효한 매칭 ID를 입력하세요', 400);
    }

    const room = await getOrCreateRoom(supabase, profile.id, matchId);

    return successResponse(room, undefined, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
