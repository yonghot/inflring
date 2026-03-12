'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Megaphone,
  DollarSign,
  Handshake,
  Inbox,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
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

/** Mini sparkline bars for stat cards */
function MiniSparkline({ color, heights }: { color: string; heights: number[] }) {
  return (
    <div className="flex items-end gap-[3px] h-8 ml-auto opacity-40">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className={`w-[4px] rounded-full ${color}`}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

const SPARKLINE_DATA = [
  [40, 65, 50, 80, 60, 90, 75],
  [30, 50, 70, 45, 85, 60, 95],
  [55, 70, 40, 80, 65, 50, 85],
];

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
      <div className="space-y-6 py-8">
        <div className="h-20 w-full bg-slate-200 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} lines={1} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      gradient: 'from-blue-500/10 via-blue-400/5 to-transparent',
      iconBg: 'bg-blue-500/15',
      color: 'text-primary',
      sparkColor: 'bg-primary',
    },
    {
      label: '총 지출',
      value: formatCurrency(stats?.totalSpend ?? 0),
      icon: DollarSign,
      gradient: 'from-green-500/10 via-green-400/5 to-transparent',
      iconBg: 'bg-green-500/15',
      color: 'text-green-600',
      sparkColor: 'bg-green-500',
    },
    {
      label: '매칭 수',
      value: stats?.matchCount ?? 0,
      icon: Handshake,
      gradient: 'from-purple-500/10 via-purple-400/5 to-transparent',
      iconBg: 'bg-purple-500/15',
      color: 'text-purple-600',
      sparkColor: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8 py-8">
      {/* Welcome Banner */}
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-light to-blue-400 p-6 md:p-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
              <Sparkles size={16} />
              <span>광고주 대시보드</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              안녕하세요, {profile?.display_name}님!
            </h1>
            <p className="mt-2 text-white/80 text-sm md:text-base">
              최적의 크리에이터를 찾아 브랜드를 성장시키세요.
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -right-4 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute top-4 right-32 w-16 h-16 rounded-full bg-white/5" />
        </div>
      </FadeIn>

      {/* Stat Cards */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={stat.label}>
              <Card className="hover:shadow-md hover:-translate-y-0.5 overflow-hidden">
                <CardContent className="p-5 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`} />
                  <div className="relative flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}>
                      <Icon size={24} className={stat.color} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-secondary">{stat.label}</p>
                      <p className={`text-xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                    <MiniSparkline color={stat.sparkColor} heights={SPARKLINE_DATA[idx]} />
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Recent Campaigns */}
      <FadeIn delay={0.3}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">
            최근 캠페인
          </h2>
        </div>
        {campaigns.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="아직 캠페인이 없습니다"
            description="첫 캠페인을 등록하고 인플루언서를 찾아보세요."
            actionLabel="캠페인 만들기"
            onAction={() => router.push('/brand/campaigns/new')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
