import { NextRequest } from 'next/server';
import { reviewCreateSchema } from '@/lib/validations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  createReview,
  getReviewsForUser,
  getAverageRating,
} from '@/lib/services/review-service';
import {
  successResponse,
  errorResponse,
  getAuthenticatedUser,
  handleServiceError,
} from '@/lib/utils/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    await getAuthenticatedUser(supabase);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse('userId 파라미터가 필요합니다', 400);
    }

    const [reviews, ratingInfo] = await Promise.all([
      getReviewsForUser(supabase, userId),
      getAverageRating(supabase, userId),
    ]);

    return successResponse(reviews, {
      total: ratingInfo.review_count,
    });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { profile } = await getAuthenticatedUser(supabase);

    const body = await request.json();
    const parsed = reviewCreateSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(', ');
      return errorResponse(message, 400);
    }

    const review = await createReview(supabase, profile.id, parsed.data);

    return successResponse(review, undefined, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
