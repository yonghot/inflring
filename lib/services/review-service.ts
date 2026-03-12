import { SupabaseClient } from '@supabase/supabase-js';
import { Review } from '@/lib/types';
import { ReviewCreateInput } from '@/lib/validations';
import {
  getReviewsByUserId,
  getReviewByContractAndReviewer,
  createReview as createReviewRepo,
  getAverageRating as getAverageRatingRepo,
} from '@/lib/repositories/review-repository';
import { getContractById } from '@/lib/repositories/contract-repository';
import {
  AuthorizationError,
  ValidationError,
} from '@/lib/utils/api-helpers';

export async function createReview(
  supabase: SupabaseClient,
  userId: string,
  data: ReviewCreateInput
): Promise<Review> {
  const contract = await getContractById(supabase, data.contractId);

  if (!contract) {
    throw new ValidationError('계약을 찾을 수 없습니다');
  }

  if (contract.status !== 'completed') {
    throw new ValidationError('완료된 계약만 리뷰를 작성할 수 있습니다');
  }

  const isCreator = contract.creator_id === userId;
  const isBrand = contract.brand_id === userId;

  if (!isCreator && !isBrand) {
    throw new AuthorizationError('계약 당사자만 리뷰를 작성할 수 있습니다');
  }

  const existing = await getReviewByContractAndReviewer(
    supabase,
    data.contractId,
    userId
  );

  if (existing) {
    throw new ValidationError('이미 해당 계약에 리뷰를 작성하셨습니다');
  }

  const revieweeId = isCreator ? contract.brand_id : contract.creator_id;

  return createReviewRepo(supabase, {
    contract_id: data.contractId,
    reviewer_id: userId,
    reviewee_id: revieweeId,
    rating: data.rating,
    communication_score: data.communicationScore ?? null,
    quality_score: data.qualityScore ?? null,
    timeliness_score: data.timelinessScore ?? null,
    comment: data.comment ?? null,
    is_public: true,
  });
}

export async function getReviewsForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Review[]> {
  return getReviewsByUserId(supabase, userId);
}

export async function getAverageRating(
  supabase: SupabaseClient,
  userId: string
): Promise<{ average_rating: number; review_count: number }> {
  return getAverageRatingRepo(supabase, userId);
}
