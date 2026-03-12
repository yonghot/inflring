'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Loader2 } from 'lucide-react';
import { CampaignCard } from '@/components/features/campaign/campaign-card';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import type { ApiResponse, Campaign } from '@/lib/types';

export default function CreatorCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch('/api/campaigns');
        const result: ApiResponse<Campaign[]> = await res.json();
        if (result.success && result.data) {
          setCampaigns(result.data.filter((c) => c.status === 'active'));
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  async function handleApply(campaignId: string) {
    setApplyingId(campaignId);
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: campaignId,
          direction: 'creator_apply',
        }),
      });

      const result: ApiResponse<unknown> = await res.json();
      if (result.success) {
        setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      }
    } catch {
      // silently fail
    } finally {
      setApplyingId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} lines={3} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold text-text-primary">캠페인 피드</h1>
        <p className="text-sm text-text-secondary mt-1">
          활성 캠페인을 둘러보고 마음에 드는 프로젝트에 지원하세요.
        </p>
      </FadeIn>

      {campaigns.length === 0 ? (
        <FadeIn delay={0.2}>
          <EmptyState
            icon={Megaphone}
            title="현재 활성 캠페인이 없습니다"
            description="새로운 캠페인이 등록되면 이곳에 표시됩니다."
          />
        </FadeIn>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <StaggerItem key={campaign.id}>
              <CampaignCard
                campaign={campaign}
                href={`/creator/campaigns/${campaign.id}`}
                actionLabel="지원하기"
                onAction={() => handleApply(campaign.id)}
                actionLoading={applyingId === campaign.id}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
