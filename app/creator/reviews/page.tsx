'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { ReviewList } from '@/components/features/review/review-list';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn } from '@/components/shared/motion-wrapper';
import type { ApiResponse, Review } from '@/lib/types';

export default function CreatorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews/received');
        const result: ApiResponse<Review[]> = await res.json();
        if (result.success && result.data) {
          setReviews(result.data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="h-8 w-40 bg-slate-200 animate-pulse rounded" />
        <CardSkeleton lines={2} />
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} lines={2} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <FadeIn>
        <h1 className="text-2xl font-bold text-text-primary">받은 리뷰</h1>
      </FadeIn>

      {reviews.length === 0 ? (
        <FadeIn delay={0.1}>
          <EmptyState
            icon={Star}
            title="받은 리뷰가 없습니다"
            description="협업이 완료되면 브랜드로부터 리뷰를 받을 수 있습니다."
          />
        </FadeIn>
      ) : (
        <FadeIn delay={0.1}>
          <ReviewList reviews={reviews} />
        </FadeIn>
      )}
    </div>
  );
}
