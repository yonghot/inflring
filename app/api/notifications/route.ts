import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  getMyNotifications,
  getUnreadCount,
} from '@/lib/services/notification-service';
import {
  successResponse,
  getAuthenticatedUser,
  handleServiceError,
} from '@/lib/utils/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { user } = await getAuthenticatedUser(supabase);

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') ?? '1');
    const limit = Number(searchParams.get('limit') ?? '20');

    const { notifications } = await getMyNotifications(
      supabase,
      user.id,
      page,
      limit
    );
    const unreadCount = await getUnreadCount(supabase, user.id);

    return successResponse(notifications, {
      total: unreadCount,
      page,
      limit,
    });
  } catch (error) {
    return handleServiceError(error);
  }
}
