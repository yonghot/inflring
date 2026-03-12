import { NextRequest } from 'next/server';
import { signupSchema } from '@/lib/validations';
import { signup } from '@/lib/services/auth-service';
import {
  successResponse,
  errorResponse,
  handleServiceError,
} from '@/lib/utils/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(', ');
      return errorResponse(message, 400);
    }

    const result = await signup(parsed.data);

    return successResponse(result, undefined, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
