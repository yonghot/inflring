'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { HoverLift } from '@/components/shared/motion-wrapper';
import { MATCH_STATUS_LABELS } from '@/lib/constants';
import type { Match, MatchStatus } from '@/lib/types';

interface MatchCardProps {
  match: Match;
  href: string;
  perspective: 'creator' | 'brand';
}

const STATUS_VARIANT: Record<MatchStatus, 'default' | 'success' | 'secondary' | 'destructive'> = {
  pending: 'secondary',
  viewed: 'default',
  accepted: 'success',
  rejected: 'destructive',
  negotiating: 'default',
  contracted: 'success',
};

const STATUS_COLOR: Record<MatchStatus, string> = {
  pending: 'bg-slate-400',
  viewed: 'bg-blue-400',
  accepted: 'bg-green-500',
  rejected: 'bg-red-500',
  negotiating: 'bg-amber-500',
  contracted: 'bg-emerald-600',
};

export function MatchCard({ match, href, perspective }: MatchCardProps) {
  const title =
    perspective === 'creator'
      ? match.campaign?.title ?? '캠페인'
      : match.creator?.channel_name ?? '크리에이터';

  const avatarUrl =
    perspective === 'brand'
      ? match.creator?.profile?.avatar_url
      : null;

  const avatarAlt =
    perspective === 'brand'
      ? match.creator?.channel_name
      : match.campaign?.title;

  const matchScore = match.match_score;

  return (
    <HoverLift>
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            {/* Profile image for brand perspective */}
            <Avatar
              src={avatarUrl}
              alt={avatarAlt ?? ''}
              size="md"
              className="shrink-0 ring-2 ring-white shadow-sm"
            />

            <div className="flex-1 min-w-0">
              <Link
                href={href}
                className="text-base font-semibold text-text-primary hover:text-primary transition-colors line-clamp-1 block"
              >
                {title}
              </Link>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-text-muted">
                <Clock size={12} aria-hidden="true" />
                <time dateTime={match.created_at}>
                  {new Date(match.created_at).toLocaleDateString('ko-KR')}
                </time>
              </div>
            </div>

            <Badge variant={STATUS_VARIANT[match.status]}>
              {MATCH_STATUS_LABELS[match.status]}
            </Badge>
          </div>

          {/* Match reasons */}
          {match.match_reasons && match.match_reasons.length > 0 && (
            <p className="text-sm text-text-secondary line-clamp-2">
              {match.match_reasons.join(', ')}
            </p>
          )}

          {/* Match score visualization */}
          {matchScore !== null && matchScore !== undefined && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">매칭 점수</span>
                <span className="font-semibold text-text-primary">{matchScore}점</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    matchScore >= 80
                      ? 'bg-green-500'
                      : matchScore >= 60
                        ? 'bg-blue-500'
                        : matchScore >= 40
                          ? 'bg-amber-500'
                          : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(100, matchScore)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </HoverLift>
  );
}
