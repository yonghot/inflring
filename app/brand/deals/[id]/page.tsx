'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { FadeIn } from '@/components/shared/motion-wrapper';
import { formatCurrency, formatNumber, getTrustScoreColor } from '@/lib/utils';
import { MATCH_STATUS_LABELS, CAMPAIGN_STATUS_LABELS, PLATFORMS } from '@/lib/constants';
import type { ApiResponse, Match, MatchStatus } from '@/lib/types';

const STATUS_VARIANT: Record<MatchStatus, 'default' | 'success' | 'secondary' | 'destructive'> = {
  pending: 'secondary',
  viewed: 'default',
  accepted: 'success',
  rejected: 'destructive',
  negotiating: 'default',
  contracted: 'success',
};

export default function BrandDealDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<'accept' | 'reject' | null>(null);

  useEffect(() => {
    async function fetchMatch() {
      try {
        const res = await fetch(`/api/matches/${params.id}`);
        const result: ApiResponse<Match> = await res.json();
        if (result.success && result.data) {
          setMatch(result.data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchMatch();
  }, [params.id]);

  async function handleAction(status: 'accepted' | 'rejected') {
    if (!match) return;
    setActionLoading(status === 'accepted' ? 'accept' : 'reject');

    try {
      const res = await fetch(`/api/matches/${match.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const result: ApiResponse<Match> = await res.json();
      if (result.success && result.data) {
        setMatch(result.data);
      }
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <CardSkeleton lines={5} />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary">딜을 찾을 수 없습니다.</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">
          돌아가기
        </Button>
      </div>
    );
  }

  const campaign = match.campaign;
  const creator = match.creator;
  const canRespond = match.status === 'pending' || match.status === 'viewed';

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

        {/* Match info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-xl">딜 상세</CardTitle>
              <Badge variant={STATUS_VARIANT[match.status]}>
                {MATCH_STATUS_LABELS[match.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-text-secondary">
              <span>매칭일: </span>
              <time dateTime={match.created_at}>
                {new Date(match.created_at).toLocaleDateString('ko-KR')}
              </time>
            </div>

            {match.match_reasons && match.match_reasons.length > 0 && (
              <div>
                <p className="text-sm font-medium text-text-primary mb-1">매칭 사유</p>
                <ul className="list-disc list-inside text-sm text-text-secondary space-y-0.5">
                  {match.match_reasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {canRespond && (
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  onClick={() => handleAction('accepted')}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === 'accept' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  수락
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleAction('rejected')}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === 'reject' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  거절
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Creator info */}
        {creator && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">크리에이터 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar
                  src={creator.profile?.avatar_url}
                  alt={creator.channel_name}
                  size="md"
                />
                <div>
                  <p className="font-medium text-text-primary">{creator.channel_name}</p>
                  <p className="text-sm text-text-secondary">
                    {PLATFORMS.find((p) => p.value === creator.platform)?.label ?? creator.platform}
                    {' / '}
                    구독자 {formatNumber(creator.subscribers)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-secondary">신뢰 온도:</span>
                <span className={getTrustScoreColor(creator.profile?.trust_score ?? 36.5)}>
                  {(creator.profile?.trust_score ?? 36.5).toFixed(1)}&deg;C
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campaign info */}
        {campaign && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">캠페인 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium text-text-primary">{campaign.title}</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {campaign.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span className="inline-flex items-center gap-1">
                  <DollarSign size={14} aria-hidden="true" />
                  {formatCurrency(campaign.budget_min)} ~ {formatCurrency(campaign.budget_max)}
                </span>
                {campaign.campaign_end && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={14} aria-hidden="true" />
                    ~{new Date(campaign.campaign_end).toLocaleDateString('ko-KR')}
                  </span>
                )}
              </div>
              <Badge>{CAMPAIGN_STATUS_LABELS[campaign.status]}</Badge>
            </CardContent>
          </Card>
        )}
      </FadeIn>
    </div>
  );
}
