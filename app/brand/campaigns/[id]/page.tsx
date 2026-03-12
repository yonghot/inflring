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
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { FadeIn } from '@/components/shared/motion-wrapper';
import { formatCurrency } from '@/lib/utils';
import {
  PLATFORMS,
  CONTENT_TYPES,
  CAMPAIGN_STATUS_LABELS,
  MATCH_STATUS_LABELS,
} from '@/lib/constants';
import type { ApiResponse, Campaign, Match, MatchStatus } from '@/lib/types';

const STATUS_VARIANT: Record<MatchStatus, 'default' | 'success' | 'secondary' | 'destructive'> = {
  pending: 'secondary',
  viewed: 'default',
  accepted: 'success',
  rejected: 'destructive',
  negotiating: 'default',
  contracted: 'success',
};

export default function BrandCampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [campaignRes, matchesRes] = await Promise.all([
          fetch(`/api/campaigns/${params.id}`),
          fetch('/api/matches'),
        ]);

        const campaignResult: ApiResponse<Campaign> = await campaignRes.json();
        const matchesResult: ApiResponse<Match[]> = await matchesRes.json();

        if (campaignResult.success && campaignResult.data) {
          setCampaign(campaignResult.data);
        }
        if (matchesResult.success && matchesResult.data) {
          setMatches(
            matchesResult.data.filter((m) => m.campaign_id === params.id)
          );
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  async function handleMatchAction(matchId: string, status: 'accepted' | 'rejected') {
    setActionLoadingId(matchId);
    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const result: ApiResponse<Match> = await res.json();
      if (result.success && result.data) {
        setMatches((prev) =>
          prev.map((m) => (m.id === matchId ? result.data! : m))
        );
      }
    } catch {
      // silently fail
    } finally {
      setActionLoadingId(null);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <CardSkeleton lines={6} />
        <CardSkeleton lines={4} />
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

  const platformLabel =
    PLATFORMS.find((p) => p.value === campaign.target_platform)?.label ??
    campaign.target_platform;
  const contentTypeLabel =
    CONTENT_TYPES.find((t) => t.value === campaign.content_type)?.label ??
    campaign.content_type;

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
          </CardContent>
        </Card>
      </FadeIn>

      {/* Applicants / proposals */}
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              지원자 / 제안 ({matches.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {matches.length === 0 ? (
              <p className="text-sm text-text-secondary py-4 text-center">
                아직 지원자가 없습니다.
              </p>
            ) : (
              <ul className="divide-y divide-border" role="list">
                {matches.map((match) => {
                  const canAct = match.status === 'pending' || match.status === 'viewed';
                  return (
                    <li
                      key={match.id}
                      className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {match.creator?.channel_name ?? '크리에이터'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={STATUS_VARIANT[match.status]} className="text-xs">
                            {MATCH_STATUS_LABELS[match.status]}
                          </Badge>
                          <span className="text-xs text-text-muted">
                            {new Date(match.created_at).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                      </div>
                      {canAct && (
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            onClick={() => handleMatchAction(match.id, 'accepted')}
                            disabled={actionLoadingId === match.id}
                          >
                            {actionLoadingId === match.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 size={14} className="mr-1" />
                            )}
                            수락
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleMatchAction(match.id, 'rejected')}
                            disabled={actionLoadingId === match.id}
                          >
                            <XCircle size={14} className="mr-1" />
                            거절
                          </Button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
