import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/auth-service';
import {
  successResponse,
  handleServiceError,
} from '@/lib/utils/api-helpers';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const result = await getCurrentUser(supabase);

    return successResponse(result);
  } catch (error) {
    return handleServiceError(error);
  }
}
