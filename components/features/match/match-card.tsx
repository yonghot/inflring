'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export function MatchCard({ match, href, perspective }: MatchCardProps) {
  const title =
    perspective === 'creator'
      ? match.campaign?.title ?? '캠페인'
      : match.creator?.channel_name ?? '크리에이터';

  return (
    <HoverLift>
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={href}
              className="text-base font-semibold text-text-primary hover:text-primary transition-colors line-clamp-1"
            >
              {title}
            </Link>
            <Badge variant={STATUS_VARIANT[match.status]}>
              {MATCH_STATUS_LABELS[match.status]}
            </Badge>
          </div>

          {match.match_reasons && match.match_reasons.length > 0 && (
            <p className="text-sm text-text-secondary line-clamp-2">
              {match.match_reasons.join(', ')}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock size={12} aria-hidden="true" />
            <time dateTime={match.created_at}>
              {new Date(match.created_at).toLocaleDateString('ko-KR')}
            </time>
          </div>
        </CardContent>
      </Card>
    </HoverLift>
  );
}
