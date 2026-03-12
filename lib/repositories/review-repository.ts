import { SupabaseClient } from '@supabase/supabase-js';
import { Review } from '@/lib/types';

const REVIEW_SELECT = '*, reviewer:profiles!reviewer_id(*), reviewee:profiles!reviewee_id(*)';

export async function getReviewsByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(REVIEW_SELECT)
    .eq('reviewee_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function getReviewByContractAndReviewer(
  supabase: SupabaseClient,
  contractId: string,
  reviewerId: string
): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .select(REVIEW_SELECT)
    .eq('contract_id', contractId)
    .eq('reviewer_id', reviewerId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function createReview(
  supabase: SupabaseClient,
  data: {
    contract_id: string;
    reviewer_id: string;
    reviewee_id: string;
    rating: number;
    communication_score?: number | null;
    quality_score?: number | null;
    timeliness_score?: number | null;
    comment?: string | null;
    is_public: boolean;
  }
): Promise<Review> {
  const { data: review, error } = await supabase
    .from('reviews')
    .insert(data)
    .select(REVIEW_SELECT)
    .single();

  if (error) throw error;

  return review;
}

export async function getAverageRating(
  supabase: SupabaseClient,
  userId: string
): Promise<{ average_rating: number; review_count: number }> {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', userId)
    .eq('is_public', true);

  if (error) throw error;

  const reviews = data ?? [];

  if (reviews.length === 0) {
    return { average_rating: 0, review_count: 0 };
  }

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);

  return {
    average_rating: Math.round((sum / reviews.length) * 10) / 10,
    review_count: reviews.length,
  };
}
