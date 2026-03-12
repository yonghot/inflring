'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Megaphone,
  DollarSign,
  Handshake,
  Inbox,
} from 'lucide-react';
import { useAuthContext } from '@/components/features/auth/auth-provider';
import { Card, CardContent } from '@/components/ui/card';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { CampaignCard } from '@/components/features/campaign/campaign-card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import { formatCurrency } from '@/lib/utils';
import type { ApiResponse, Campaign, Match, Brand } from '@/lib/types';

interface StatsData {
  activeCampaigns: number;
  totalSpend: number;
  matchCount: number;
}

export default function BrandDashboardPage() {
  const { profile } = useAuthContext();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [campaignsRes, matchesRes, meRes] = await Promise.all([
          fetch('/api/campaigns'),
          fetch('/api/matches'),
          fetch('/api/auth/me'),
        ]);

        const campaignsResult: ApiResponse<Campaign[]> = await campaignsRes.json();
        const matchesResult: ApiResponse<Match[]> = await matchesRes.json();
        const meResult: ApiResponse<{ brand?: Brand }> = await meRes.json();

        if (campaignsResult.success && campaignsResult.data) {
          setCampaigns(campaignsResult.data.slice(0, 4));
        }

        setStats({
          activeCampaigns:
            campaignsResult.data?.filter((c) => c.status === 'active').length ?? 0,
          totalSpend: meResult.data?.brand?.total_spend ?? 0,
          matchCount: matchesResult.data?.length ?? 0,
        });
      } catch {
        // silently fail
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
      label: '활성 캠페인',
      value: stats?.activeCampaigns ?? 0,
      icon: Megaphone,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: '총 지출',
      value: formatCurrency(stats?.totalSpend ?? 0),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: '매칭 수',
      value: stats?.matchCount ?? 0,
      icon: Handshake,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
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
          최근 캠페인
        </h2>
        {campaigns.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="아직 캠페인이 없습니다"
            description="첫 캠페인을 등록하고 인플루언서를 찾아보세요."
            actionLabel="캠페인 만들기"
            onAction={() => router.push('/brand/campaigns/new')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                href={`/brand/campaigns/${campaign.id}`}
                showStatus
              />
            ))}
          </div>
        )}
      </FadeIn>
    </div>
  );
}
