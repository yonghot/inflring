'use client';

import Link from 'next/link';
import { Clock, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HoverLift } from '@/components/shared/motion-wrapper';
import { formatCurrency } from '@/lib/utils';
import { CONTRACT_STATUS_LABELS } from '@/lib/constants';
import type { ContractStatus } from '@/lib/types';

export interface ContractSummary {
  id: string;
  campaign_title: string;
  other_party_name: string;
  amount: number;
  status: ContractStatus;
  created_at: string;
}

interface ContractCardProps {
  contract: ContractSummary;
  href: string;
}

const STATUS_VARIANT: Record<ContractStatus, 'default' | 'success' | 'secondary' | 'destructive'> = {
  draft: 'secondary',
  pending_sign: 'default',
  active: 'default',
  content_submitted: 'default',
  under_review: 'default',
  revision_requested: 'destructive',
  approved: 'success',
  completed: 'success',
  disputed: 'destructive',
  cancelled: 'destructive',
};

const STATUS_BG: Record<ContractStatus, string> = {
  draft: 'bg-slate-100 text-slate-600',
  pending_sign: 'bg-amber-50 text-amber-600',
  active: 'bg-blue-50 text-blue-600',
  content_submitted: 'bg-yellow-50 text-yellow-600',
  under_review: 'bg-indigo-50 text-indigo-600',
  revision_requested: 'bg-orange-50 text-orange-600',
  approved: 'bg-emerald-50 text-emerald-600',
  completed: 'bg-green-50 text-green-700',
  disputed: 'bg-red-50 text-red-600',
  cancelled: 'bg-red-50 text-red-500',
};

export function ContractCard({ contract, href }: ContractCardProps) {
  return (
    <HoverLift>
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={href}
              className="text-base font-semibold text-text-primary hover:text-primary transition-colors line-clamp-1"
            >
              {contract.campaign_title}
            </Link>
            <Badge
              className={STATUS_BG[contract.status]}
              variant={STATUS_VARIANT[contract.status]}
            >
              {CONTRACT_STATUS_LABELS[contract.status] ?? contract.status}
            </Badge>
          </div>

          <p className="text-sm text-text-secondary">
            {contract.other_party_name}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
              <DollarSign size={14} className="text-green-600" aria-hidden="true" />
              {formatCurrency(contract.amount)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Clock size={12} aria-hidden="true" />
              <time dateTime={contract.created_at}>
                {new Date(contract.created_at).toLocaleDateString('ko-KR')}
              </time>
            </div>
          </div>
        </CardContent>
      </Card>
    </HoverLift>
  );
}
