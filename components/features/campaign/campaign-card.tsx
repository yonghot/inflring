'use client';

import Link from 'next/link';
import { Calendar, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HoverLift } from '@/components/shared/motion-wrapper';
import { formatCurrency } from '@/lib/utils';
import { PLATFORMS, CONTENT_TYPES, CAMPAIGN_STATUS_LABELS } from '@/lib/constants';
import type { Campaign, CampaignStatus } from '@/lib/types';

interface CampaignCardProps {
  campaign: Campaign;
  href: string;
  actionLabel?: string;
  onAction?: () => void;
  actionLoading?: boolean;
  showStatus?: boolean;
}

const STATUS_VARIANT: Record<CampaignStatus, 'default' | 'success' | 'secondary' | 'destructive'> = {
  draft: 'secondary',
  active: 'success',
  paused: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
};

/** Unsplash thumbnail based on campaign category */
const CATEGORY_IMAGES: Record<string, string> = {
  branded: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop&q=80',
  ppl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop&q=80',
  review: 'https://images.unsplash.com/photo-1586953208270-767fc11b288b?w=400&h=200&fit=crop&q=80',
  unboxing: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=200&fit=crop&q=80',
  shorts: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=200&fit=crop&q=80',
  other: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=200&fit=crop&q=80',
};

function getPlatformLabel(value: string): string {
  return PLATFORMS.find((p) => p.value === value)?.label ?? value;
}

function getContentTypeLabel(value: string): string {
  return CONTENT_TYPES.find((t) => t.value === value)?.label ?? value;
}

function getDaysRemaining(endDate: string | null): number | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function CampaignCard({
  campaign,
  href,
  actionLabel,
  onAction,
  actionLoading,
  showStatus,
}: CampaignCardProps) {
  const daysRemaining = campaign.status === 'active' ? getDaysRemaining(campaign.campaign_end) : null;
  const thumbnailUrl = CATEGORY_IMAGES[campaign.content_type] ?? CATEGORY_IMAGES.other;

  return (
    <HoverLift>
      <Card className="h-full flex flex-col overflow-hidden">
        {/* Thumbnail */}
        <div className="relative h-36 w-full overflow-hidden bg-slate-100">
          <img
            src={thumbnailUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {/* Status badge overlay */}
          {showStatus && (
            <div className="absolute top-3 right-3">
              <Badge variant={STATUS_VARIANT[campaign.status]} className="shadow-sm">
                {CAMPAIGN_STATUS_LABELS[campaign.status]}
              </Badge>
            </div>
          )}
          {/* Days remaining overlay */}
          {daysRemaining !== null && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-text-primary shadow-sm">
              <Clock size={12} aria-hidden="true" />
              <span>D-{daysRemaining}</span>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-5 space-y-3">
          <Link
            href={href}
            className="text-base font-semibold text-text-primary hover:text-primary transition-colors line-clamp-1 block"
          >
            {campaign.title}
          </Link>

          <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {campaign.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">
              {getPlatformLabel(campaign.target_platform)}
            </Badge>
            <Badge variant="outline">
              {getContentTypeLabel(campaign.content_type)}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className="inline-flex items-center gap-1 font-medium">
              <DollarSign size={14} aria-hidden="true" className="text-green-600" />
              <span className="text-text-primary">
                {formatCurrency(campaign.budget_min)} ~ {formatCurrency(campaign.budget_max)}
              </span>
            </span>
            {campaign.campaign_end && (
              <span className="inline-flex items-center gap-1">
                <Calendar size={14} aria-hidden="true" />
                ~{new Date(campaign.campaign_end).toLocaleDateString('ko-KR')}
              </span>
            )}
          </div>

          {/* Progress bar for active campaigns */}
          {campaign.status === 'active' && campaign.campaign_start && campaign.campaign_end && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-text-muted">
                <span>캠페인 진행률</span>
                <span>
                  {Math.min(
                    100,
                    Math.round(
                      ((Date.now() - new Date(campaign.campaign_start).getTime()) /
                        (new Date(campaign.campaign_end).getTime() - new Date(campaign.campaign_start).getTime())) *
                        100
                    )
                  )}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        ((Date.now() - new Date(campaign.campaign_start).getTime()) /
                          (new Date(campaign.campaign_end).getTime() - new Date(campaign.campaign_start).getTime())) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {actionLabel && onAction && (
            <div className="pt-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onAction();
                }}
                disabled={actionLoading}
                className="w-full"
              >
                {actionLabel}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </HoverLift>
  );
}
