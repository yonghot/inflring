'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Eye,
  TrendingUp,
  Thermometer,
  Send,
  Loader2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { FadeIn } from '@/components/shared/motion-wrapper';
import { formatNumber, formatCurrency, getTrustScoreColor } from '@/lib/utils';
import { PLATFORMS } from '@/lib/constants';
import type { ApiResponse, Creator, Campaign } from '@/lib/types';

export default function BrandCreatorDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [proposing, setProposing] = useState(false);
  const [proposed, setProposed] = useState(false);

  useEffect(() => {
    async function fetchCreator() {
      try {
        const res = await fetch(`/api/creators/${params.id}`);
        const result: ApiResponse<Creator> = await res.json();
        if (result.success && result.data) {
          setCreator(result.data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchCreator();
  }, [params.id]);

  async function openProposalDialog() {
    setDialogOpen(true);
    if (campaigns.length === 0) {
      try {
        const res = await fetch('/api/campaigns');
        const result: ApiResponse<Campaign[]> = await res.json();
        if (result.success && result.data) {
          setCampaigns(result.data.filter((c) => c.status === 'active'));
        }
      } catch {
        // silently fail
      }
    }
  }

  async function handlePropose() {
    if (!selectedCampaignId || !creator) return;
    setProposing(true);

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: selectedCampaignId,
          creator_id: creator.id,
          direction: 'brand_direct_offer',
        }),
      });

      const result: ApiResponse<unknown> = await res.json();
      if (result.success) {
        setProposed(true);
        setTimeout(() => setDialogOpen(false), 1500);
      }
    } catch {
      // silently fail
    } finally {
      setProposing(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <CardSkeleton lines={6} />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary">크리에이터를 찾을 수 없습니다.</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">
          돌아가기
        </Button>
      </div>
    );
  }

  const platformLabel =
    PLATFORMS.find((p) => p.value === creator.platform)?.label ?? creator.platform;

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
          <CardContent className="p-6 md:p-8 space-y-6">
            {/* Profile header */}
            <div className="flex items-center gap-4">
              <Avatar
                src={creator.profile?.avatar_url}
                alt={creator.channel_name}
                size="lg"
              />
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  {creator.channel_name}
                </h1>
                <p className="text-sm text-text-secondary">{platformLabel}</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-slate-50">
                <Users size={18} className="mx-auto text-text-muted mb-1" aria-hidden="true" />
                <p className="text-lg font-bold text-text-primary">{formatNumber(creator.subscribers)}</p>
                <p className="text-xs text-text-secondary">구독자</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-50">
                <Eye size={18} className="mx-auto text-text-muted mb-1" aria-hidden="true" />
                <p className="text-lg font-bold text-text-primary">{formatNumber(creator.avg_views)}</p>
                <p className="text-xs text-text-secondary">평균 조회</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-50">
                <TrendingUp size={18} className="mx-auto text-text-muted mb-1" aria-hidden="true" />
                <p className="text-lg font-bold text-text-primary">
                  {(creator.engagement_rate * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-text-secondary">참여율</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-50">
                <Thermometer size={18} className="mx-auto text-text-muted mb-1" aria-hidden="true" />
                <p className={`text-lg font-bold ${getTrustScoreColor(creator.profile?.trust_score ?? 36.5)}`}>
                  {(creator.profile?.trust_score ?? 36.5).toFixed(1)}&deg;C
                </p>
                <p className="text-xs text-text-secondary">신뢰 온도</p>
              </div>
            </div>

            {/* Categories */}
            {creator.content_category.length > 0 && (
              <div>
                <p className="text-sm text-text-secondary mb-2">콘텐츠 카테고리</p>
                <div className="flex flex-wrap gap-1.5">
                  {creator.content_category.map((cat) => (
                    <Badge key={cat} variant="secondary">{cat}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Price range */}
            {(creator.min_price !== null || creator.max_price !== null) && (
              <div>
                <p className="text-sm text-text-secondary mb-1">단가 범위</p>
                <p className="font-medium text-text-primary">
                  {creator.min_price !== null && creator.max_price !== null
                    ? `${formatCurrency(creator.min_price)} ~ ${formatCurrency(creator.max_price)}`
                    : creator.min_price !== null
                      ? `${formatCurrency(creator.min_price)} ~`
                      : `~ ${formatCurrency(creator.max_price!)}`}
                </p>
              </div>
            )}

            {/* Proposal button */}
            <div className="pt-4 border-t border-border">
              <Button onClick={openProposalDialog} className="w-full sm:w-auto">
                <Send size={16} className="mr-2" />
                제안하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Proposal dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogClose onClose={() => setDialogOpen(false)} />
        <DialogHeader>
          <DialogTitle>크리에이터에게 제안</DialogTitle>
          <DialogDescription>
            {creator.channel_name}에게 제안할 캠페인을 선택하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {proposed ? (
            <div className="text-center py-4">
              <p className="text-accent font-medium">제안이 전송되었습니다.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="campaign-select">캠페인 선택</Label>
                <Select
                  id="campaign-select"
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                >
                  <option value="" disabled>캠페인을 선택하세요</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </Select>
              </div>

              <Button
                onClick={handlePropose}
                disabled={!selectedCampaignId || proposing}
                className="w-full"
              >
                {proposing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    전송 중...
                  </>
                ) : (
                  '제안 보내기'
                )}
              </Button>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
}
