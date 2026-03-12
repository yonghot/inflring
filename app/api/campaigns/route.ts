import { NextRequest } from 'next/server';
import { campaignSchema } from '@/lib/validations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  create,
  getCampaigns,
} from '@/lib/services/campaign-service';
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
      status: searchParams.get('status') ?? undefined,
      brandId: searchParams.get('brandId') ?? undefined,
    };

    const campaigns = await getCampaigns(supabase, filters);

    return successResponse(campaigns, { total: campaigns.length });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    const body = await request.json();
    const parsed = campaignSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(', ');
      return errorResponse(message, 400);
    }

    const campaign = await create(supabase, profile.id, parsed.data);

    return successResponse(campaign, undefined, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
