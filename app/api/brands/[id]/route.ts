import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getBrandById } from '@/lib/services/brand-service';
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

    const brand = await getBrandById(supabase, id);

    return successResponse(brand);
  } catch (error) {
    return handleServiceError(error);
  }
}
