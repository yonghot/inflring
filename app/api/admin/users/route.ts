import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getUsers } from '@/lib/services/admin-service';
import {
  successResponse,
  errorResponse,
  getAuthenticatedUser,
  handleServiceError,
} from '@/lib/utils/api-helpers';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    if (profile.role !== 'admin') {
      return errorResponse('관리자 권한이 필요합니다', 403);
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;
    const role = searchParams.get('role') ?? undefined;

    const result = await getUsers(supabase, role, page, limit);

    return successResponse(result.data, result.meta);
  } catch (error) {
    return handleServiceError(error);
  }
}
