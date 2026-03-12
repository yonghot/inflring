import { NextResponse } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { ApiResponse, Profile } from '@/lib/types';
import { getProfileById } from '@/lib/repositories/profile-repository';

export function successResponse<T>(
  data: T,
  meta?: ApiResponse<T>['meta'],
  status = 200
): NextResponse<ApiResponse<T>> {
  const body: ApiResponse<T> = { success: true, data };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

export function errorResponse(
  message: string,
  status: number
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

export async function getAuthenticatedUser(
  supabase: SupabaseClient
): Promise<{ user: { id: string; email: string }; profile: Profile }> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new AuthenticationError('인증이 필요합니다');
  }

  const profile = await getProfileById(supabase, user.id);

  if (!profile) {
    throw new AuthenticationError('프로필을 찾을 수 없습니다');
  }

  return {
    user: { id: user.id, email: user.email ?? '' },
    profile,
  };
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export function handleServiceError(error: unknown): NextResponse<ApiResponse<never>> {
  if (error instanceof AuthenticationError) {
    return errorResponse(error.message, 401);
  }
  if (error instanceof AuthorizationError) {
    return errorResponse(error.message, 403);
  }
  if (error instanceof ValidationError) {
    return errorResponse(error.message, 400);
  }

  const message =
    error instanceof Error ? error.message : '서버 내부 오류가 발생했습니다';
  return errorResponse(message, 500);
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
