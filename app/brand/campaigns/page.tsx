'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Megaphone } from 'lucide-react';
import { CampaignCard } from '@/components/features/campaign/campaign-card';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import type { ApiResponse, Campaign } from '@/lib/types';

export default function BrandCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch('/api/campaigns');
        const result: ApiResponse<Campaign[]> = await res.json();
        if (result.success && result.data) {
          setCampaigns(result.data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">내 캠페인</h1>
            <p className="text-sm text-text-secondary mt-1">
              등록한 캠페인을 관리하세요.
            </p>
          </div>
          <Button onClick={() => router.push('/brand/campaigns/new')}>
            <Plus size={18} className="mr-1" />
            새 캠페인
          </Button>
        </div>
      </FadeIn>

      {campaigns.length === 0 ? (
        <FadeIn delay={0.2}>
          <EmptyState
            icon={Megaphone}
            title="아직 캠페인이 없습니다"
            description="첫 캠페인을 등록하고 인플루언서를 찾아보세요."
            actionLabel="캠페인 만들기"
            onAction={() => router.push('/brand/campaigns/new')}
          />
        </FadeIn>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <StaggerItem key={campaign.id}>
              <CampaignCard
                campaign={campaign}
                href={`/brand/campaigns/${campaign.id}`}
                showStatus
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
