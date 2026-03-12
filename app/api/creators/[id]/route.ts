import { NextRequest } from 'next/server';
import { creatorProfileSchema } from '@/lib/validations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  getCreatorById,
  updateCreatorProfile,
} from '@/lib/services/creator-service';
import {
  successResponse,
  errorResponse,
  getAuthenticatedUser,
  handleServiceError,
} from '@/lib/utils/api-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const creator = await getCreatorById(supabase, id);

    return successResponse(creator);
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    const body = await request.json();
    const parsed = creatorProfileSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(', ');
      return errorResponse(message, 400);
    }

    const creator = await updateCreatorProfile(
      supabase,
      id,
      profile.id,
      parsed.data
    );

    return successResponse(creator);
  } catch (error) {
    return handleServiceError(error);
  }
}
