import { NextRequest } from 'next/server';
import { contractUpdateSchema } from '@/lib/validations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  getContractById,
  signContract,
  updateStatus,
} from '@/lib/services/contract-service';
import {
  successResponse,
  errorResponse,
  getAuthenticatedUser,
  handleServiceError,
} from '@/lib/utils/api-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    const contract = await getContractById(supabase, profile.id, id);

    return successResponse(contract);
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

    if (body.action === 'sign') {
      const contract = await signContract(supabase, profile.id, id);
      return successResponse(contract);
    }

    const parsed = contractUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(', ');
      return errorResponse(message, 400);
    }

    const contract = await updateStatus(
      supabase,
      profile.id,
      id,
      parsed.data.status
    );

    return successResponse(contract);
  } catch (error) {
    return handleServiceError(error);
  }
}
