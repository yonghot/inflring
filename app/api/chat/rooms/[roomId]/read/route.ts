import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { markAsRead } from '@/lib/services/chat-service';
import {
  successResponse,
  getAuthenticatedUser,
  handleServiceError,
} from '@/lib/utils/api-helpers';

interface RouteParams {
  params: Promise<{ roomId: string }>;
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const { roomId } = await params;
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    await markAsRead(supabase, profile.id, roomId);

    return successResponse({ message: '메시지를 읽음 처리했습니다' });
  } catch (error) {
    return handleServiceError(error);
  }
}
