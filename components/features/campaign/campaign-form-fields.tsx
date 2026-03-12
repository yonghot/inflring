'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CategoryCheckboxGrid } from '@/components/features/creator/category-checkbox-grid';
import { PLATFORMS, CONTENT_TYPES, CONTENT_CATEGORIES } from '@/lib/constants';
import type { ContentType, Platform } from '@/lib/types';

export interface CampaignFormData {
  title: string;
  description: string;
  content_type: ContentType | '';
  target_platform: Platform | 'multi' | '';
  target_categories: string[];
  min_subscribers: string;
  max_subscribers: string;
  budget_min: string;
  budget_max: string;
  campaign_start: string;
  campaign_end: string;
  requirements: string;
}

export const INITIAL_CAMPAIGN_FORM: CampaignFormData = {
  title: '',
  description: '',
  content_type: '',
  target_platform: '',
  target_categories: [],
  min_subscribers: '',
  max_subscribers: '',
  budget_min: '',
  budget_max: '',
  campaign_start: '',
  campaign_end: '',
  requirements: '',
};

interface CampaignFormFieldsProps {
  formData: CampaignFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onToggleCategory: (cat: string) => void;
  disabled: boolean;
}

export function CampaignFormFields({
  formData,
  onChange,
  onSelectChange,
  onToggleCategory,
  disabled,
}: CampaignFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">캠페인 제목</Label>
        <Input id="title" name="title" placeholder="캠페인 제목을 입력하세요" value={formData.title} onChange={onChange} disabled={disabled} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">캠페인 설명</Label>
        <Textarea id="description" name="description" placeholder="캠페인에 대해 자세히 설명해주세요" value={formData.description} onChange={onChange} disabled={disabled} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="content_type">콘텐츠 유형</Label>
          <Select id="content_type" name="content_type" value={formData.content_type} onChange={onSelectChange} disabled={disabled}>
            <option value="" disabled>선택하세요</option>
            {CONTENT_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="target_platform">플랫폼</Label>
          <Select id="target_platform" name="target_platform" value={formData.target_platform} onChange={onSelectChange} disabled={disabled}>
            <option value="" disabled>선택하세요</option>
            {PLATFORMS.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
            <option value="multi">멀티 플랫폼</option>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>타겟 카테고리</Label>
        <CategoryCheckboxGrid
          categories={CONTENT_CATEGORIES}
          selected={formData.target_categories}
          onToggle={onToggleCategory}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min_subscribers">최소 구독자</Label>
          <Input id="min_subscribers" name="min_subscribers" type="number" placeholder="1000" value={formData.min_subscribers} onChange={onChange} disabled={disabled} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_subscribers">최대 구독자</Label>
          <Input id="max_subscribers" name="max_subscribers" type="number" placeholder="1000000" value={formData.max_subscribers} onChange={onChange} disabled={disabled} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget_min">최소 예산 (원)</Label>
          <Input id="budget_min" name="budget_min" type="number" placeholder="100000" value={formData.budget_min} onChange={onChange} disabled={disabled} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget_max">최대 예산 (원)</Label>
          <Input id="budget_max" name="budget_max" type="number" placeholder="5000000" value={formData.budget_max} onChange={onChange} disabled={disabled} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="campaign_start">시작일</Label>
          <Input id="campaign_start" name="campaign_start" type="date" value={formData.campaign_start} onChange={onChange} disabled={disabled} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="campaign_end">종료일</Label>
          <Input id="campaign_end" name="campaign_end" type="date" value={formData.campaign_end} onChange={onChange} disabled={disabled} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">요구사항 (선택)</Label>
        <Textarea id="requirements" name="requirements" placeholder="크리에이터에게 요청할 사항을 입력하세요" value={formData.requirements} onChange={onChange} disabled={disabled} />
      </div>
    </>
  );
}
