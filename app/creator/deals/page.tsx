'use client';

import { useState, useEffect } from 'react';
import { Handshake } from 'lucide-react';
import { MatchCard } from '@/components/features/match/match-card';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import { cn } from '@/lib/utils';
import type { ApiResponse, Match, MatchStatus } from '@/lib/types';

const FILTER_TABS: { label: string; value: MatchStatus | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '대기', value: 'pending' },
  { label: '수락', value: 'accepted' },
  { label: '거절', value: 'rejected' },
];

export default function CreatorDealsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<MatchStatus | 'all'>('all');

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch('/api/matches');
        const result: ApiResponse<Match[]> = await res.json();
        if (result.success && result.data) {
          setMatches(result.data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  const filteredMatches =
    activeFilter === 'all'
      ? matches
      : matches.filter((m) => m.status === activeFilter);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-slate-200 animate-pulse rounded" />
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
        <h1 className="text-2xl font-bold text-text-primary">내 딜</h1>
      </FadeIn>

      {/* Filter tabs */}
      <FadeIn delay={0.1}>
        <div className="flex gap-2" role="tablist" aria-label="딜 상태 필터">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={activeFilter === tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
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

      {filteredMatches.length === 0 ? (
        <FadeIn delay={0.2}>
          <EmptyState
            icon={Handshake}
            title="딜이 없습니다"
            description={
              activeFilter === 'all'
                ? '캠페인에 지원하면 딜이 이곳에 표시됩니다.'
                : '해당 상태의 딜이 없습니다.'
            }
          />
        </FadeIn>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((match) => (
            <StaggerItem key={match.id}>
              <MatchCard
                match={match}
                href={`/creator/deals/${match.id}`}
                perspective="creator"
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
