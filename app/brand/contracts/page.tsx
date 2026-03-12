'use client';

import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { ContractCard, type ContractSummary } from '@/components/features/contract/contract-card';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import { cn } from '@/lib/utils';
import type { ApiResponse, ContractStatus } from '@/lib/types';

const FILTER_TABS: { label: string; value: ContractStatus | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '진행 중', value: 'active' },
  { label: '검토 중', value: 'under_review' },
  { label: '완료', value: 'completed' },
  { label: '취소', value: 'cancelled' },
];

export default function BrandContractsPage() {
  const [contracts, setContracts] = useState<ContractSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ContractStatus | 'all'>('all');

  useEffect(() => {
    async function fetchContracts() {
      try {
        const res = await fetch('/api/contracts');
        const result: ApiResponse<ContractSummary[]> = await res.json();
        if (result.success && result.data) {
          setContracts(result.data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchContracts();
  }, []);

  const filteredContracts =
    activeFilter === 'all'
      ? contracts
      : contracts.filter((c) => c.status === activeFilter);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-slate-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} lines={2} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold text-text-primary">계약 관리</h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="계약 상태 필터">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={activeFilter === tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                activeFilter === tab.value
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-secondary border border-border hover:bg-slate-50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {filteredContracts.length === 0 ? (
        <FadeIn delay={0.2}>
          <EmptyState
            icon={FileText}
            title="계약이 없습니다"
            description={
              activeFilter === 'all'
                ? '딜이 확정되면 계약이 이곳에 표시됩니다.'
                : '해당 상태의 계약이 없습니다.'
            }
          />
        </FadeIn>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContracts.map((contract) => (
            <StaggerItem key={contract.id}>
              <ContractCard
                contract={contract}
                href={`/brand/contracts/${contract.id}`}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
