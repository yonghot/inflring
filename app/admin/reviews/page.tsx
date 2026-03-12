'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import type { ApiResponse, Review } from '@/lib/types';

/** 별점 렌더링 헬퍼 */
function StarRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < value ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-200 text-slate-200'}
        />
      ))}
      <span className="ml-1 text-xs text-text-secondary">{value}</span>
    </span>
  );
}

/** 점수 셀 (null 처리 포함) */
function ScoreCell({ score }: { score: number | null }) {
  if (score == null) return <span className="text-text-muted">-</span>;
  return <span className="text-text-secondary">{score}</span>;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        const res = await fetch(`/api/admin/reviews?${params}`);
        const result: ApiResponse<Review[]> = await res.json();
        if (result.success && result.data) {
          setReviews(result.data);
          if (result.meta?.total) {
            setTotalPages(Math.ceil(result.meta.total / 20));
          }
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [page]);

  return (
    <div className="space-y-6 py-8">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">리뷰 관리</h1>
          <p className="text-sm text-text-secondary mt-1">플랫폼 전체 리뷰를 조회합니다.</p>
        </div>
      </FadeIn>

      {loading ? (
        <TableSkeleton rows={8} cols={7} />
      ) : reviews.length === 0 ? (
        <FadeIn>
          <EmptyState icon={Star} title="리뷰가 없습니다" description="아직 작성된 리뷰가 없습니다." />
        </FadeIn>
      ) : (
        <StaggerContainer>
          <StaggerItem>
            <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">작성자</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">대상자</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">평점</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">소통</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">품질</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">시간 준수</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">작성일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-text-primary">
                        {review.reviewer?.display_name ?? '-'}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {review.reviewee?.display_name ?? '-'}
                      </td>
                      <td className="px-4 py-3">
                        <StarRating value={review.rating} />
                      </td>
                      <td className="px-4 py-3">
                        <ScoreCell score={review.communication_score} />
                      </td>
                      <td className="px-4 py-3">
                        <ScoreCell score={review.quality_score} />
                      </td>
                      <td className="px-4 py-3">
                        <ScoreCell score={review.timeliness_score} />
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {new Date(review.created_at).toLocaleDateString('ko-KR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </StaggerItem>
        </StaggerContainer>
      )}

      {!loading && reviews.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            이전
          </Button>
          <span className="text-sm text-text-secondary">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
