import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getStats } from '@/lib/services/admin-service';
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

    if (profile.role !== 'admin') {
      return errorResponse('관리자 권한이 필요합니다', 403);
    }

    const stats = await getStats(supabase);

    return successResponse(stats);
  } catch (error) {
    return handleServiceError(error);
  }
}
