'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Handshake,
  DollarSign,
  Thermometer,
  Inbox,
} from 'lucide-react';
import { useAuthContext } from '@/components/features/auth/auth-provider';
import { Card, CardContent } from '@/components/ui/card';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { MatchCard } from '@/components/features/match/match-card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import { formatCurrency, getTrustScoreColor } from '@/lib/utils';
import type { ApiResponse, Match, Creator } from '@/lib/types';

interface StatsData {
  activeDeals: number;
  totalRevenue: number;
  trustScore: number;
}

export default function CreatorDashboardPage() {
  const { profile } = useAuthContext();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [matchesRes, meRes] = await Promise.all([
          fetch('/api/matches'),
          fetch('/api/auth/me'),
        ]);

        const matchesResult: ApiResponse<Match[]> = await matchesRes.json();
        const meResult: ApiResponse<{ profile: { trust_score: number }; creator?: Creator }> =
          await meRes.json();

        if (matchesResult.success && matchesResult.data) {
          setMatches(matchesResult.data.slice(0, 5));
        }

        if (meResult.success && meResult.data) {
          const creator = meResult.data.creator;
          setStats({
            activeDeals: matchesResult.data?.filter(
              (m) => m.status === 'accepted' || m.status === 'negotiating' || m.status === 'contracted'
            ).length ?? 0,
            totalRevenue: creator?.total_revenue ?? 0,
            trustScore: meResult.data.profile.trust_score,
          });
        }
      } catch {
        // silently fail, stats remain null
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} lines={1} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} lines={2} />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: '진행 중 딜',
      value: stats?.activeDeals ?? 0,
      icon: Handshake,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: '총 수익',
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: '신뢰 온도',
      value: `${(stats?.trustScore ?? 36.5).toFixed(1)}\u00B0C`,
      icon: Thermometer,
      color: getTrustScoreColor(stats?.trustScore ?? 36.5),
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="text-2xl font-bold text-text-primary">
          안녕하세요, {profile?.display_name}님!
        </h1>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={stat.label}>
              <Card className="hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                    <Icon size={24} className={stat.color} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      <FadeIn delay={0.3}>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          최근 매칭
        </h2>
        {matches.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="아직 매칭이 없습니다"
            description="캠페인 피드에서 마음에 드는 캠페인에 지원해보세요."
            actionLabel="캠페인 둘러보기"
            onAction={() => router.push('/creator/campaigns')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                href={`/creator/deals/${match.id}`}
                perspective="creator"
              />
            ))}
          </div>
        )}
      </FadeIn>
    </div>
  );
}
