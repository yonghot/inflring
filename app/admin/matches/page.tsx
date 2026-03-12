'use client';

import { useState, useEffect } from 'react';
import { GitMerge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import type { ApiResponse, Match, MatchStatus } from '@/lib/types';

/** 매칭 상태 Badge 맵 */
const STATUS_BADGE: Record<MatchStatus, { label: string; className: string }> = {
  pending: { label: '대기', className: 'bg-slate-100 text-slate-500 border-slate-200' },
  viewed: { label: '확인됨', className: 'bg-blue-100 text-blue-600 border-blue-200' },
  accepted: { label: '수락', className: 'bg-green-100 text-green-700 border-green-200' },
  rejected: { label: '거절', className: 'bg-red-100 text-red-700 border-red-200' },
  negotiating: { label: '협의중', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  contracted: { label: '계약완료', className: 'bg-purple-100 text-purple-700 border-purple-200' },
};

/** 매칭 방향 레이블 맵 */
const DIRECTION_LABEL: Record<string, string> = {
  campaign_to_creator: '캠페인→크리에이터',
  creator_apply: '크리에이터 지원',
  creator_reverse_pitch: '역제안',
  brand_direct_offer: '광고주 직접 제안',
};

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (statusFilter) params.set('status', statusFilter);
        const res = await fetch(`/api/admin/matches?${params}`);
        const result: ApiResponse<Match[]> = await res.json();
        if (result.success && result.data) {
          setMatches(result.data);
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
    fetchMatches();
  }, [page, statusFilter]);

  return (
    <div className="space-y-6 py-8">
      <FadeIn>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">매칭 관리</h1>
            <p className="text-sm text-text-secondary mt-1">캠페인-크리에이터 매칭 현황을 조회합니다.</p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">전체</option>
            <option value="pending">대기</option>
            <option value="viewed">확인됨</option>
            <option value="accepted">수락</option>
            <option value="rejected">거절</option>
            <option value="negotiating">협의중</option>
            <option value="contracted">계약완료</option>
          </select>
        </div>
      </FadeIn>

      {loading ? (
        <TableSkeleton rows={8} cols={6} />
      ) : matches.length === 0 ? (
        <FadeIn>
          <EmptyState icon={GitMerge} title="매칭이 없습니다" description="조건에 맞는 매칭이 없습니다." />
        </FadeIn>
      ) : (
        <StaggerContainer>
          <StaggerItem>
            <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">캠페인</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">크리에이터</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">매칭 점수</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">방향</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">상태</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">생성일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {matches.map((match) => {
                    const badge = STATUS_BADGE[match.status];
                    return (
                      <tr key={match.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-text-primary max-w-[180px] truncate">
                          {match.campaign?.title ?? '-'}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {match.creator?.channel_name ?? '-'}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {match.match_score != null ? `${match.match_score}점` : '-'}
                        </td>
                        <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                          {DIRECTION_LABEL[match.direction] ?? match.direction}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={badge.className}>{badge.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                          {new Date(match.created_at).toLocaleDateString('ko-KR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </StaggerItem>
        </StaggerContainer>
      )}

      {!loading && matches.length > 0 && (
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
