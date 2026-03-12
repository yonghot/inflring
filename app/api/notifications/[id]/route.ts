import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { markAsRead } from '@/lib/services/notification-service';
import {
  successResponse,
  getAuthenticatedUser,
  handleServiceError,
} from '@/lib/utils/api-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { user } = await getAuthenticatedUser(supabase);

    const notification = await markAsRead(supabase, id, user.id);

    return successResponse(notification);
  } catch (error) {
    return handleServiceError(error);
  }
}
