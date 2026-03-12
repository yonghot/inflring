'use client';

import { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import { formatNumber } from '@/lib/utils';
import type { ApiResponse, Creator, Platform } from '@/lib/types';

/** 플랫폼 Badge 레이블 맵 */
const PLATFORM_LABEL: Record<Platform, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  naver_blog: '네이버 블로그',
};

/** 플랫폼 Badge 색상 맵 */
const PLATFORM_COLOR: Record<Platform, string> = {
  youtube: 'bg-red-100 text-red-700 border-red-200',
  instagram: 'bg-pink-100 text-pink-700 border-pink-200',
  tiktok: 'bg-slate-100 text-slate-700 border-slate-200',
  naver_blog: 'bg-green-100 text-green-700 border-green-200',
};

export default function AdminCreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchCreators() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (platformFilter) params.set('platform', platformFilter);
        const res = await fetch(`/api/admin/creators?${params}`);
        const result: ApiResponse<Creator[]> = await res.json();
        if (result.success && result.data) {
          setCreators(result.data);
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
    fetchCreators();
  }, [page, platformFilter]);

  return (
    <div className="space-y-6 py-8">
      <FadeIn>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">크리에이터 관리</h1>
            <p className="text-sm text-text-secondary mt-1">등록된 크리에이터 채널 정보를 조회합니다.</p>
          </div>
          <select
            value={platformFilter}
            onChange={(e) => { setPlatformFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">전체</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="naver_blog">네이버 블로그</option>
          </select>
        </div>
      </FadeIn>

      {loading ? (
        <TableSkeleton rows={8} cols={6} />
      ) : creators.length === 0 ? (
        <FadeIn>
          <EmptyState icon={UserCheck} title="크리에이터가 없습니다" description="조건에 맞는 크리에이터가 없습니다." />
        </FadeIn>
      ) : (
        <StaggerContainer>
          <StaggerItem>
            <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">채널명</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">크리에이터명</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">플랫폼</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">구독자</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">참여율</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {creators.map((creator) => (
                    <tr key={creator.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-text-primary">{creator.channel_name}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {creator.profile?.display_name ?? '-'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={PLATFORM_COLOR[creator.platform]}
                        >
                          {PLATFORM_LABEL[creator.platform]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {formatNumber(creator.subscribers)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {creator.engagement_rate.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3">
                        {creator.is_available ? (
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">활성</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200">비활성</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </StaggerItem>
        </StaggerContainer>
      )}

      {!loading && creators.length > 0 && (
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
