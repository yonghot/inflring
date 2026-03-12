'use client';

import Link from 'next/link';
import { Calendar, DollarSign } from 'lucide-react';
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

function getPlatformLabel(value: string): string {
  return PLATFORMS.find((p) => p.value === value)?.label ?? value;
}

function getContentTypeLabel(value: string): string {
  return CONTENT_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function CampaignCard({
  campaign,
  href,
  actionLabel,
  onAction,
  actionLoading,
  showStatus,
}: CampaignCardProps) {
  return (
    <HoverLift>
      <Card className="h-full flex flex-col">
        <CardContent className="flex-1 p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={href}
              className="text-base font-semibold text-text-primary hover:text-primary transition-colors line-clamp-1"
            >
              {campaign.title}
            </Link>
            {showStatus && (
              <Badge variant={STATUS_VARIANT[campaign.status]}>
                {CAMPAIGN_STATUS_LABELS[campaign.status]}
              </Badge>
            )}
          </div>

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
