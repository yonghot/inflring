'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Thermometer,
  Eye,
  TrendingUp,
  Heart,
  Youtube,
  Instagram,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
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

/** Platform icon component */
function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  switch (platform) {
    case 'youtube':
      return <Youtube size={14} className={className ?? 'text-red-500'} aria-hidden="true" />;
    case 'instagram':
      return <Instagram size={14} className={className ?? 'text-pink-500'} aria-hidden="true" />;
    case 'tiktok':
      // Lucide doesn't have TikTok, use a music note or styled text
      return (
        <span className={`text-[11px] font-black ${className ?? 'text-black'}`} aria-hidden="true">
          T
        </span>
      );
    case 'naver_blog':
      return (
        <span className={`text-[11px] font-black ${className ?? 'text-green-500'}`} aria-hidden="true">
          N
        </span>
      );
    default:
      return null;
  }
}

export function CreatorCard({ creator, href }: CreatorCardProps) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <HoverLift>
      <Card className="h-full">
        <CardContent className="p-5 space-y-4">
          {/* Header: Avatar + Name + Bookmark */}
          <div className="flex items-start gap-3">
            <Avatar
              src={creator.profile?.avatar_url}
              alt={creator.channel_name}
              size="lg"
              className="h-16 w-16 text-lg ring-2 ring-white shadow-md"
            />
            <div className="flex-1 min-w-0">
              <Link
                href={href}
                className="text-base font-semibold text-text-primary hover:text-primary transition-colors block truncate"
              >
                {creator.channel_name}
              </Link>
              <div className="flex items-center gap-1.5 mt-1">
                <PlatformIcon platform={creator.platform} />
                <p className="text-sm text-text-secondary">
                  {getPlatformLabel(creator.platform)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBookmarked((prev) => !prev)}
              className="shrink-0 rounded-lg p-1.5 text-text-muted hover:text-primary hover:bg-primary/5 transition-colors"
              aria-label={bookmarked ? '관심 해제' : '관심 등록'}
            >
              {bookmarked ? (
                <BookmarkCheck size={20} className="text-primary fill-primary/20" />
              ) : (
                <Bookmark size={20} />
              )}
            </button>
          </div>

          {/* Category badges */}
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

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-text-muted mb-0.5">
                <Users size={12} aria-hidden="true" />
                <span className="text-[11px]">구독자</span>
              </div>
              <p className="text-sm font-bold text-text-primary">
                {formatNumber(creator.subscribers)}
              </p>
            </div>
            <div className="text-center border-x border-slate-200">
              <div className="flex items-center justify-center gap-1 text-text-muted mb-0.5">
                <Eye size={12} aria-hidden="true" />
                <span className="text-[11px]">평균 조회</span>
              </div>
              <p className="text-sm font-bold text-text-primary">
                {formatNumber(creator.avg_views)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-text-muted mb-0.5">
                <TrendingUp size={12} aria-hidden="true" />
                <span className="text-[11px]">참여율</span>
              </div>
              <p className="text-sm font-bold text-text-primary">
                {(creator.engagement_rate * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Trust score + Price */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <Thermometer size={14} aria-hidden="true" className="text-text-secondary" />
              <span className={`font-medium ${getTrustScoreColor(creator.profile?.trust_score ?? 36.5)}`}>
                {(creator.profile?.trust_score ?? 36.5).toFixed(1)}&#176;C
              </span>
            </div>
            {(creator.min_price !== null || creator.max_price !== null) && (
              <p className="text-text-secondary">
                {creator.min_price !== null && creator.max_price !== null
                  ? `${formatCurrency(creator.min_price)} ~ ${formatCurrency(creator.max_price)}`
                  : creator.min_price !== null
                    ? `${formatCurrency(creator.min_price)} ~`
                    : `~ ${formatCurrency(creator.max_price!)}`}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </HoverLift>
  );
}
