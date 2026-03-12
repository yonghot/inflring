import { NextRequest } from 'next/server';
import { matchUpdateSchema } from '@/lib/validations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { updateMatchStatus } from '@/lib/services/match-service';
import {
  successResponse,
  errorResponse,
  getAuthenticatedUser,
  handleServiceError,
} from '@/lib/utils/api-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    const body = await request.json();
    const parsed = matchUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(', ');
      return errorResponse(message, 400);
    }

    const match = await updateMatchStatus(
      supabase,
      id,
      profile.id,
      parsed.data
    );

    return successResponse(match);
  } catch (error) {
    return handleServiceError(error);
  }
}
