'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { ApiResponse, Review } from '@/lib/types';

interface ReviewFormProps {
  contractId: string;
  onSubmitted: (review: Review) => void;
}

function StarRating({
  value,
  onChange,
  label,
  size = 'lg',
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  size?: 'sm' | 'lg';
}) {
  const [hovered, setHovered] = useState(0);
  const starSize = size === 'lg' ? 28 : 18;

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
      </label>
      <div
        className="flex gap-1"
        role="radiogroup"
        aria-label={label}
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star}점`}
          >
            <Star
              size={starSize}
              className={cn(
                'transition-colors duration-150',
                (hovered || value) >= star
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-transparent text-slate-300'
              )}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReviewForm({ contractId, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [communicationScore, setCommunicationScore] = useState(0);
  const [qualityScore, setQualityScore] = useState(0);
  const [timelinessScore, setTimelinessScore] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('별점을 선택해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const body = {
        contract_id: contractId,
        rating,
        communication_score: communicationScore || null,
        quality_score: qualityScore || null,
        timeliness_score: timelinessScore || null,
        comment: comment.trim() || null,
      };

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result: ApiResponse<Review> = await res.json();

      if (result.success && result.data) {
        onSubmitted(result.data);
      } else {
        setError(result.error ?? '리뷰 등록에 실패했습니다.');
        setIsLoading(false);
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">리뷰 작성</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {error && (
            <div role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <StarRating
            value={rating}
            onChange={setRating}
            label="전체 평점"
            size="lg"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StarRating
              value={communicationScore}
              onChange={setCommunicationScore}
              label="커뮤니케이션"
              size="sm"
            />
            <StarRating
              value={qualityScore}
              onChange={setQualityScore}
              label="콘텐츠 품질"
              size="sm"
            />
            <StarRating
              value={timelinessScore}
              onChange={setTimelinessScore}
              label="시간 준수"
              size="sm"
            />
          </div>

          <div>
            <label htmlFor="review-comment" className="block text-sm font-medium text-text-primary mb-1.5">
              한줄 리뷰 (선택)
            </label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="협업 경험에 대해 자유롭게 작성해주세요."
              disabled={isLoading}
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />등록 중...</>
            ) : (
              '리뷰 등록'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
