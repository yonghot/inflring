import { NextRequest } from 'next/server';
import { messageCreateSchema } from '@/lib/validations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getMessages, sendMessage } from '@/lib/services/chat-service';
import {
  successResponse,
  errorResponse,
  getAuthenticatedUser,
  handleServiceError,
} from '@/lib/utils/api-helpers';

interface RouteParams {
  params: Promise<{ roomId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { roomId } = await params;
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') ?? '1');
    const limit = Number(searchParams.get('limit') ?? '50');

    const messages = await getMessages(
      supabase,
      profile.id,
      roomId,
      page,
      limit
    );

    return successResponse(messages, { page, limit });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { roomId } = await params;
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    const body = await request.json();
    const parsed = messageCreateSchema.safeParse({ ...body, roomId });

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(', ');
      return errorResponse(message, 400);
    }

    const result = await sendMessage(
      supabase,
      profile.id,
      roomId,
      parsed.data.content,
      parsed.data.messageType
    );

    return successResponse(result, undefined, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
