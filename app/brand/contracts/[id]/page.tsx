'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, DollarSign, FileText, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { FadeIn } from '@/components/shared/motion-wrapper';
import { ContractTimeline } from '@/components/features/contract/contract-timeline';
import { formatCurrency } from '@/lib/utils';
import { CONTRACT_STATUS_LABELS } from '@/lib/constants';
import type { ApiResponse, Contract } from '@/lib/types';

export default function BrandContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContract() {
      try {
        const res = await fetch(`/api/contracts/${params.id}`);
        const result: ApiResponse<Contract> = await res.json();
        if (result.success && result.data) {
          setContract(result.data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchContract();
  }, [params.id]);

  async function handleAction(action: string) {
    if (!contract || actionLoading) return;
    setActionLoading(action);

    try {
      const res = await fetch(`/api/contracts/${contract.id}/${action}`, {
        method: 'PATCH',
      });
      const result: ApiResponse<Contract> = await res.json();
      if (result.success && result.data) {
        setContract(result.data);
      }
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded" />
        <CardSkeleton lines={4} />
        <CardSkeleton lines={3} />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-text-secondary">계약을 찾을 수 없습니다.</p>
              <Button className="mt-4" onClick={() => router.push('/brand/contracts')}>
                목록으로 돌아가기
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    );
  }

  const canSign = contract.status === 'pending_sign' && !contract.signed_by_brand;
  const canReview = contract.status === 'content_submitted' || contract.status === 'under_review';
  const canComplete = contract.status === 'approved';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <FadeIn>
        <button
          onClick={() => router.push('/brand/contracts')}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-2"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          계약 목록
        </button>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-text-primary">
            {contract.match?.campaign?.title ?? '계약 상세'}
          </h1>
          <Badge className="shrink-0">
            {CONTRACT_STATUS_LABELS[contract.status] ?? contract.status}
          </Badge>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">진행 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <ContractTimeline currentStatus={contract.status} />
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">계약 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
                <DollarSign size={18} className="text-green-600 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-text-muted">계약 금액</p>
                  <p className="text-sm font-semibold text-text-primary">
                    {formatCurrency(contract.amount)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
                <DollarSign size={18} className="text-amber-600 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-text-muted">플랫폼 수수료</p>
                  <p className="text-sm font-semibold text-text-primary">
                    {formatCurrency(contract.platform_fee)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
                <Calendar size={18} className="text-blue-600 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-text-muted">납품 기한</p>
                  <p className="text-sm font-semibold text-text-primary">
                    {new Date(contract.delivery_deadline).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
                <RefreshCw size={18} className="text-purple-600 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-text-muted">수정 횟수</p>
                  <p className="text-sm font-semibold text-text-primary">
                    {contract.revision_count} / {contract.max_revisions}회
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-text-muted shrink-0" aria-hidden="true" />
                <p className="text-xs text-text-muted">콘텐츠 요구사항</p>
              </div>
              <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
                {contract.content_requirements}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-muted">크리에이터 서명</p>
                <p className={contract.signed_by_creator ? 'text-green-600 font-medium' : 'text-text-secondary'}>
                  {contract.signed_by_creator ? '서명 완료' : '미서명'}
                </p>
              </div>
              <div>
                <p className="text-text-muted">브랜드 서명</p>
                <p className={contract.signed_by_brand ? 'text-green-600 font-medium' : 'text-text-secondary'}>
                  {contract.signed_by_brand ? '서명 완료' : '미서명'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {(canSign || canReview || canComplete) && (
        <FadeIn delay={0.3}>
          <Card>
            <CardContent className="p-5 flex flex-col sm:flex-row gap-3">
              {canSign && (
                <Button
                  onClick={() => handleAction('sign')}
                  disabled={actionLoading === 'sign'}
                  className="flex-1"
                >
                  {actionLoading === 'sign' ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />서명 중...</>
                  ) : (
                    '계약 서명하기'
                  )}
                </Button>
              )}
              {canReview && (
                <>
                  <Button
                    onClick={() => handleAction('approve')}
                    disabled={actionLoading === 'approve'}
                    className="flex-1"
                  >
                    {actionLoading === 'approve' ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />승인 중...</>
                    ) : (
                      '콘텐츠 승인'
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleAction('request-revision')}
                    disabled={actionLoading === 'request-revision'}
                    className="flex-1"
                  >
                    {actionLoading === 'request-revision' ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />요청 중...</>
                    ) : (
                      '수정 요청'
                    )}
                  </Button>
                </>
              )}
              {canComplete && (
                <Button
                  onClick={() => handleAction('complete')}
                  disabled={actionLoading === 'complete'}
                  className="flex-1"
                >
                  {actionLoading === 'complete' ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />처리 중...</>
                  ) : (
                    '완료 및 정산하기'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}
