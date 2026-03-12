import { NextRequest } from 'next/server';
import { matchCreateSchema } from '@/lib/validations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  createMatch,
  getMyMatches,
} from '@/lib/services/match-service';
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

    const matches = await getMyMatches(supabase, profile.id, profile.role);

    return successResponse(matches, { total: matches.length });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    const body = await request.json();
    const parsed = matchCreateSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(', ');
      return errorResponse(message, 400);
    }

    const match = await createMatch(supabase, profile.id, parsed.data);

    return successResponse(match, undefined, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
