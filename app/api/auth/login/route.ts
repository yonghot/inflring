import { NextRequest } from 'next/server';
import { loginSchema } from '@/lib/validations';
import { login } from '@/lib/services/auth-service';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  handleServiceError,
} from '@/lib/utils/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(', ');
      return errorResponse(message, 400);
    }

    const supabase = await createServerSupabaseClient();
    const result = await login(supabase, parsed.data);

    return successResponse(result);
  } catch (error) {
    return handleServiceError(error);
  }
}
