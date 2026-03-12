import { NextRequest } from 'next/server';
import { contractCreateSchema } from '@/lib/validations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  createContract,
  getMyContracts,
} from '@/lib/services/contract-service';
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

    const contracts = await getMyContracts(supabase, profile.id);

    return successResponse(contracts, { total: contracts.length });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    const body = await request.json();
    const parsed = contractCreateSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(', ');
      return errorResponse(message, 400);
    }

    const contract = await createContract(supabase, profile.id, parsed.data);

    return successResponse(contract, undefined, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
