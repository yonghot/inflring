'use client';

import { useState, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import { formatCurrency } from '@/lib/utils';
import type { ApiResponse, Campaign, CampaignStatus } from '@/lib/types';

/** 캠페인 상태 Badge 맵 */
const STATUS_BADGE: Record<CampaignStatus, { label: string; className: string }> = {
  active: { label: '진행중', className: 'bg-green-100 text-green-700 border-green-200' },
  completed: { label: '완료', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  paused: { label: '일시중단', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  draft: { label: '초안', className: 'bg-slate-100 text-slate-500 border-slate-200' },
  cancelled: { label: '취소', className: 'bg-red-100 text-red-700 border-red-200' },
};

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchCampaigns() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (statusFilter) params.set('status', statusFilter);
        const res = await fetch(`/api/admin/campaigns?${params}`);
        const result: ApiResponse<Campaign[]> = await res.json();
        if (result.success && result.data) {
          setCampaigns(result.data);
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
    fetchCampaigns();
  }, [page, statusFilter]);

  return (
    <div className="space-y-6 py-8">
      <FadeIn>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">캠페인 관리</h1>
            <p className="text-sm text-text-secondary mt-1">플랫폼 전체 캠페인을 조회합니다.</p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">전체</option>
            <option value="active">진행중</option>
            <option value="completed">완료</option>
            <option value="paused">일시중단</option>
            <option value="draft">초안</option>
            <option value="cancelled">취소</option>
          </select>
        </div>
      </FadeIn>

      {loading ? (
        <TableSkeleton rows={8} cols={6} />
      ) : campaigns.length === 0 ? (
        <FadeIn>
          <EmptyState icon={Megaphone} title="캠페인이 없습니다" description="조건에 맞는 캠페인이 없습니다." />
        </FadeIn>
      ) : (
        <StaggerContainer>
          <StaggerItem>
            <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">캠페인명</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">광고주</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">플랫폼</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">예산 범위</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">상태</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">등록일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {campaigns.map((campaign) => {
                    const badge = STATUS_BADGE[campaign.status];
                    return (
                      <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-text-primary max-w-[200px] truncate">
                          {campaign.title}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {campaign.brand?.company_name ?? '-'}
                        </td>
                        <td className="px-4 py-3 text-text-secondary capitalize">
                          {campaign.target_platform}
                        </td>
                        <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                          {formatCurrency(campaign.budget_min)} ~ {formatCurrency(campaign.budget_max)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={badge.className}>{badge.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                          {new Date(campaign.created_at).toLocaleDateString('ko-KR')}
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

      {!loading && campaigns.length > 0 && (
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
