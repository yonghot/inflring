'use client';

import Link from 'next/link';
import { Users, Thermometer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { HoverLift } from '@/components/shared/motion-wrapper';
import { formatNumber, formatCurrency, getTrustScoreColor } from '@/lib/utils';
import { PLATFORMS } from '@/lib/constants';
import type { Creator } from '@/lib/types';

interface CreatorCardProps {
  creator: Creator;
  href: string;
}

function getPlatformLabel(value: string): string {
  return PLATFORMS.find((p) => p.value === value)?.label ?? value;
}

export function CreatorCard({ creator, href }: CreatorCardProps) {
  return (
    <HoverLift>
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar
              src={creator.profile?.avatar_url}
              alt={creator.channel_name}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <Link
                href={href}
                className="text-base font-semibold text-text-primary hover:text-primary transition-colors block truncate"
              >
                {creator.channel_name}
              </Link>
              <p className="text-sm text-text-secondary">
                {getPlatformLabel(creator.platform)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {creator.content_category.slice(0, 3).map((cat) => (
              <Badge key={cat} variant="secondary">
                {cat}
              </Badge>
            ))}
            {creator.content_category.length > 3 && (
              <Badge variant="secondary">
                +{creator.content_category.length - 3}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Users size={14} aria-hidden="true" />
              <span>구독자 {formatNumber(creator.subscribers)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Thermometer size={14} aria-hidden="true" className="text-text-secondary" />
              <span className={getTrustScoreColor(creator.profile?.trust_score ?? 36.5)}>
                {(creator.profile?.trust_score ?? 36.5).toFixed(1)}&#176;C
              </span>
            </div>
          </div>

          {(creator.min_price !== null || creator.max_price !== null) && (
            <p className="text-sm text-text-secondary">
              {creator.min_price !== null && creator.max_price !== null
                ? `${formatCurrency(creator.min_price)} ~ ${formatCurrency(creator.max_price)}`
                : creator.min_price !== null
                  ? `${formatCurrency(creator.min_price)} ~`
                  : `~ ${formatCurrency(creator.max_price!)}`}
            </p>
          )}
        </CardContent>
      </Card>
    </HoverLift>
  );
}
