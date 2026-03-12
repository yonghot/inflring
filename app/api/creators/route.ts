import { NextRequest } from 'next/server';
import { creatorOnboardingSchema } from '@/lib/validations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  onboard,
  getCreators,
} from '@/lib/services/creator-service';
import {
  successResponse,
  errorResponse,
  getAuthenticatedUser,
  handleServiceError,
} from '@/lib/utils/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);

    const filters = {
      platform: searchParams.get('platform') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      minSubscribers: searchParams.get('minSubscribers')
        ? Number(searchParams.get('minSubscribers'))
        : undefined,
      maxSubscribers: searchParams.get('maxSubscribers')
        ? Number(searchParams.get('maxSubscribers'))
        : undefined,
      available: searchParams.get('available')
        ? searchParams.get('available') === 'true'
        : undefined,
    };

    const creators = await getCreators(supabase, filters);

    return successResponse(creators, { total: creators.length });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    const body = await request.json();
    const parsed = creatorOnboardingSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(', ');
      return errorResponse(message, 400);
    }

    const creator = await onboard(supabase, profile.id, parsed.data);

    return successResponse(creator, undefined, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
