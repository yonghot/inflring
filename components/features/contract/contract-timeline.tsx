import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContractStatus } from '@/lib/types';

const TIMELINE_STEPS: { status: ContractStatus; label: string }[] = [
  { status: 'draft', label: '초안 작성' },
  { status: 'pending_sign', label: '서명 대기' },
  { status: 'active', label: '진행 중' },
  { status: 'content_submitted', label: '콘텐츠 제출' },
  { status: 'under_review', label: '검토 중' },
  { status: 'approved', label: '승인' },
  { status: 'completed', label: '완료' },
];

const STATUS_ORDER: Record<ContractStatus, number> = {
  draft: 0,
  pending_sign: 1,
  active: 2,
  content_submitted: 3,
  under_review: 4,
  revision_requested: 4,
  approved: 5,
  completed: 6,
  disputed: -1,
  cancelled: -1,
};

interface ContractTimelineProps {
  currentStatus: ContractStatus;
  className?: string;
}

export function ContractTimeline({ currentStatus, className }: ContractTimelineProps) {
  const currentOrder = STATUS_ORDER[currentStatus];
  const isTerminal = currentStatus === 'cancelled' || currentStatus === 'disputed';

  if (isTerminal) {
    return (
      <div className={cn('rounded-lg border border-danger/20 bg-danger/5 px-4 py-3', className)}>
        <p className="text-sm font-medium text-danger">
          {currentStatus === 'cancelled' ? '계약이 취소되었습니다.' : '분쟁이 진행 중입니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-0', className)}>
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {TIMELINE_STEPS.map((step, index) => {
          const stepOrder = STATUS_ORDER[step.status];
          const isCompleted = stepOrder < currentOrder;
          const isCurrent = stepOrder === currentOrder;

          return (
            <div key={step.status} className="flex items-center flex-1 min-w-0 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0',
                    isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : isCurrent
                        ? 'border-primary bg-primary text-white shadow-md shadow-primary/30'
                        : 'border-slate-300 bg-white text-text-muted'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check size={14} aria-hidden="true" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>
                <p className={cn(
                  'mt-2 text-[11px] text-center whitespace-nowrap',
                  isCurrent ? 'font-semibold text-primary' : isCompleted ? 'text-text-secondary' : 'text-text-muted'
                )}>
                  {step.label}
                </p>
              </div>

              {index < TIMELINE_STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-1.5 mt-[-1.5rem]',
                    stepOrder < currentOrder ? 'bg-green-500' : 'bg-slate-200'
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {currentStatus === 'revision_requested' && (
        <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5">
          <p className="text-sm font-medium text-orange-700">
            수정이 요청되었습니다. 콘텐츠를 수정 후 다시 제출해주세요.
          </p>
        </div>
      )}
    </div>
  );
}
