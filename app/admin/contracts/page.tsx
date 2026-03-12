'use client';

import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import { formatCurrency } from '@/lib/utils';
import type { ApiResponse, Contract, ContractStatus } from '@/lib/types';

/** 계약 상태 Badge 맵 */
const STATUS_BADGE: Record<ContractStatus, { label: string; className: string }> = {
  draft: { label: '초안', className: 'bg-slate-100 text-slate-500 border-slate-200' },
  pending_sign: { label: '서명 대기', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  active: { label: '진행중', className: 'bg-green-100 text-green-700 border-green-200' },
  content_submitted: { label: '콘텐츠 제출', className: 'bg-blue-100 text-blue-600 border-blue-200' },
  under_review: { label: '검토중', className: 'bg-purple-100 text-purple-600 border-purple-200' },
  revision_requested: { label: '수정 요청', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  approved: { label: '승인됨', className: 'bg-teal-100 text-teal-700 border-teal-200' },
  completed: { label: '완료', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  disputed: { label: '분쟁중', className: 'bg-red-100 text-red-700 border-red-200' },
  cancelled: { label: '취소', className: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchContracts() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (statusFilter) params.set('status', statusFilter);
        const res = await fetch(`/api/admin/contracts?${params}`);
        const result: ApiResponse<Contract[]> = await res.json();
        if (result.success && result.data) {
          setContracts(result.data);
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
    fetchContracts();
  }, [page, statusFilter]);

  return (
    <div className="space-y-6 py-8">
      <FadeIn>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">계약 관리</h1>
            <p className="text-sm text-text-secondary mt-1">플랫폼 전체 계약 현황을 조회합니다.</p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">전체</option>
            <option value="draft">초안</option>
            <option value="pending_sign">서명 대기</option>
            <option value="active">진행중</option>
            <option value="content_submitted">콘텐츠 제출</option>
            <option value="completed">완료</option>
            <option value="cancelled">취소</option>
          </select>
        </div>
      </FadeIn>

      {loading ? (
        <TableSkeleton rows={8} cols={7} />
      ) : contracts.length === 0 ? (
        <FadeIn>
          <EmptyState icon={FileText} title="계약이 없습니다" description="조건에 맞는 계약이 없습니다." />
        </FadeIn>
      ) : (
        <StaggerContainer>
          <StaggerItem>
            <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">계약 ID</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">금액</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">수수료</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">크리에이터 서명</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">광고주 서명</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">상태</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">생성일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contracts.map((contract) => {
                    const badge = STATUS_BADGE[contract.status];
                    return (
                      <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                          {contract.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-text-primary font-medium whitespace-nowrap">
                          {formatCurrency(contract.amount)}
                        </td>
                        <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                          {formatCurrency(contract.platform_fee)}
                        </td>
                        <td className="px-4 py-3">
                          {contract.signed_by_creator ? (
                            <CheckCircle2 size={18} className="text-green-600" />
                          ) : (
                            <XCircle size={18} className="text-slate-300" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {contract.signed_by_brand ? (
                            <CheckCircle2 size={18} className="text-green-600" />
                          ) : (
                            <XCircle size={18} className="text-slate-300" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={badge.className}>{badge.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                          {new Date(contract.created_at).toLocaleDateString('ko-KR')}
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

      {!loading && contracts.length > 0 && (
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
