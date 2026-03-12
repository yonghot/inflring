'use client';

import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { cn, formatTimeAgo } from '@/lib/utils';
import type { Review } from '@/lib/types';

interface ReviewListProps {
  reviews: Review[];
}

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating}점`} role="img">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-transparent text-slate-300'
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function AverageRatingCard({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const avgCommunication =
    reviews.filter((r) => r.communication_score !== null).length > 0
      ? reviews.reduce((sum, r) => sum + (r.communication_score ?? 0), 0) /
        reviews.filter((r) => r.communication_score !== null).length
      : null;
  const avgQuality =
    reviews.filter((r) => r.quality_score !== null).length > 0
      ? reviews.reduce((sum, r) => sum + (r.quality_score ?? 0), 0) /
        reviews.filter((r) => r.quality_score !== null).length
      : null;
  const avgTimeliness =
    reviews.filter((r) => r.timeliness_score !== null).length > 0
      ? reviews.reduce((sum, r) => sum + (r.timeliness_score ?? 0), 0) /
        reviews.filter((r) => r.timeliness_score !== null).length
      : null;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/[0.02]">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-text-primary">
              {avgRating.toFixed(1)}
            </p>
            <StarDisplay rating={Math.round(avgRating)} size={18} />
            <p className="mt-1 text-xs text-text-muted">{reviews.length}개 리뷰</p>
          </div>

          <div className="flex-1 w-full space-y-2">
            {[
              { label: '커뮤니케이션', value: avgCommunication },
              { label: '콘텐츠 품질', value: avgQuality },
              { label: '시간 준수', value: avgTimeliness },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-24 shrink-0">{item.label}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                    style={{ width: item.value ? `${(item.value / 5) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs font-medium text-text-primary w-8 text-right">
                  {item.value ? item.value.toFixed(1) : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-4">
      <AverageRatingCard reviews={reviews} />

      <div className="space-y-3">
        {reviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Avatar
                  src={review.reviewer?.avatar_url}
                  alt={review.reviewer?.display_name}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {review.reviewer?.display_name ?? '익명'}
                    </p>
                    <span className="text-xs text-text-muted shrink-0">
                      {formatTimeAgo(review.created_at)}
                    </span>
                  </div>
                  <div className="mt-1">
                    <StarDisplay rating={review.rating} />
                  </div>

                  {(review.communication_score || review.quality_score || review.timeliness_score) && (
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-text-muted">
                      {review.communication_score && (
                        <span>커뮤니케이션 {review.communication_score.toFixed(1)}</span>
                      )}
                      {review.quality_score && (
                        <span>품질 {review.quality_score.toFixed(1)}</span>
                      )}
                      {review.timeliness_score && (
                        <span>시간 준수 {review.timeliness_score.toFixed(1)}</span>
                      )}
                    </div>
                  )}

                  {review.comment && (
                    <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
