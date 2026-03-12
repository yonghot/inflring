import { createServerSupabaseClient } from '@/lib/supabase/server';
import { markAllAsRead } from '@/lib/services/notification-service';
import {
  successResponse,
  getAuthenticatedUser,
  handleServiceError,
} from '@/lib/utils/api-helpers';

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    const { user } = await getAuthenticatedUser(supabase);

    await markAllAsRead(supabase, user.id);

    return successResponse({ message: '모든 알림을 읽음 처리했습니다' });
  } catch (error) {
    return handleServiceError(error);
  }
}
