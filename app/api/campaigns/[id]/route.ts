import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCampaignById } from '@/lib/services/campaign-service';
import {
  successResponse,
  handleServiceError,
} from '@/lib/utils/api-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const campaign = await getCampaignById(supabase, id);

    return successResponse(campaign);
  } catch (error) {
    return handleServiceError(error);
  }
}
