import { NextRequest } from 'next/server';
import { brandOnboardingSchema } from '@/lib/validations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { onboard } from '@/lib/services/brand-service';
import {
  successResponse,
  errorResponse,
  getAuthenticatedUser,
  handleServiceError,
} from '@/lib/utils/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    const body = await request.json();
    const parsed = brandOnboardingSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(', ');
      return errorResponse(message, 400);
    }

    const brand = await onboard(supabase, profile.id, parsed.data);

    return successResponse(brand, undefined, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
