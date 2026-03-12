'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Loader2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { FadeIn } from '@/components/shared/motion-wrapper';
import { formatCurrency } from '@/lib/utils';
import { PLATFORMS, CONTENT_TYPES, CAMPAIGN_STATUS_LABELS } from '@/lib/constants';
import type { ApiResponse, Campaign } from '@/lib/types';

export default function CreatorCampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        const res = await fetch(`/api/campaigns/${params.id}`);
        const result: ApiResponse<Campaign> = await res.json();
        if (result.success && result.data) {
          setCampaign(result.data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchCampaign();
  }, [params.id]);

  async function handleApply() {
    if (!campaign) return;
    setApplying(true);

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: campaign.id,
          direction: 'creator_apply',
        }),
      });

      const result: ApiResponse<unknown> = await res.json();
      if (result.success) {
        setApplied(true);
      }
    } catch {
      // silently fail
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <CardSkeleton lines={6} />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary">캠페인을 찾을 수 없습니다.</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">
          돌아가기
        </Button>
      </div>
    );
  }

  const platformLabel = PLATFORMS.find((p) => p.value === campaign.target_platform)?.label ?? campaign.target_platform;
  const contentTypeLabel = CONTENT_TYPES.find((t) => t.value === campaign.content_type)?.label ?? campaign.content_type;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <FadeIn>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          뒤로
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-xl">{campaign.title}</CardTitle>
              <Badge>{CAMPAIGN_STATUS_LABELS[campaign.status]}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
              {campaign.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign size={16} className="text-text-muted" aria-hidden="true" />
                <span className="text-text-secondary">예산:</span>
                <span className="font-medium">
                  {formatCurrency(campaign.budget_min)} ~ {formatCurrency(campaign.budget_max)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FileText size={16} className="text-text-muted" aria-hidden="true" />
                <span className="text-text-secondary">콘텐츠:</span>
                <span className="font-medium">{contentTypeLabel}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users size={16} className="text-text-muted" aria-hidden="true" />
                <span className="text-text-secondary">플랫폼:</span>
                <span className="font-medium">{platformLabel}</span>
              </div>

              {campaign.campaign_end && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-text-muted" aria-hidden="true" />
                  <span className="text-text-secondary">마감일:</span>
                  <span className="font-medium">
                    {new Date(campaign.campaign_end).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              )}
            </div>

            {campaign.target_categories.length > 0 && (
              <div>
                <p className="text-sm text-text-secondary mb-2">타겟 카테고리</p>
                <div className="flex flex-wrap gap-1.5">
                  {campaign.target_categories.map((cat) => (
                    <Badge key={cat} variant="secondary">{cat}</Badge>
                  ))}
                </div>
              </div>
            )}

            {campaign.requirements && (
              <div>
                <p className="text-sm text-text-secondary mb-2">요구사항</p>
                <p className="text-sm text-text-primary whitespace-pre-wrap">
                  {campaign.requirements}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleApply}
                disabled={applying || applied}
                className="w-full sm:w-auto"
              >
                {applying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    지원 중...
                  </>
                ) : applied ? (
                  '지원 완료'
                ) : (
                  '지원하기'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
