'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { brandOnboardingSchema } from '@/lib/validations';
import type { BrandOnboardingInput } from '@/lib/validations';
import type { ApiResponse, Brand } from '@/lib/types';
import { BUSINESS_CATEGORIES } from '@/lib/constants';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

export default function BrandOnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BrandOnboardingInput>({
    companyName: '',
    businessCategory: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    websiteUrl: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BrandOnboardingInput, string>>>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError('');

    const parsed = brandOnboardingSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof BrandOnboardingInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof BrandOnboardingInput;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const result: ApiResponse<Brand> = await response.json();

      if (!result.success) {
        setServerError(result.error ?? '등록에 실패했습니다');
        setIsLoading(false);
        return;
      }

      router.push('/brand/dashboard');
    } catch {
      setServerError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md hover:shadow-sm hover:translate-y-0">
        <CardHeader className="text-center">
          <p className="text-2xl font-bold text-primary mb-2">인플링</p>
          <CardTitle className="text-xl">광고주 정보 입력</CardTitle>
          <CardDescription>회사 기본 정보를 입력해주세요</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            {serverError && (
              <div
                role="alert"
                className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="companyName">회사명</Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="회사명을 입력하세요"
                value={formData.companyName}
                onChange={handleChange}
                error={!!errors.companyName}
                disabled={isLoading}
                aria-describedby={errors.companyName ? 'companyName-error' : undefined}
              />
              {errors.companyName && (
                <p id="companyName-error" className="text-sm text-danger">
                  {errors.companyName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessCategory">업종</Label>
              <Select
                id="businessCategory"
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleSelectChange}
                error={!!errors.businessCategory}
                disabled={isLoading}
                aria-describedby={errors.businessCategory ? 'businessCategory-error' : undefined}
              >
                <option value="" disabled>
                  업종을 선택하세요
                </option>
                {BUSINESS_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              {errors.businessCategory && (
                <p id="businessCategory-error" className="text-sm text-danger">
                  {errors.businessCategory}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName">담당자명</Label>
              <Input
                id="contactName"
                name="contactName"
                type="text"
                placeholder="담당자 이름을 입력하세요"
                value={formData.contactName}
                onChange={handleChange}
                error={!!errors.contactName}
                disabled={isLoading}
                aria-describedby={errors.contactName ? 'contactName-error' : undefined}
              />
              {errors.contactName && (
                <p id="contactName-error" className="text-sm text-danger">
                  {errors.contactName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">담당자 이메일</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                value={formData.contactEmail}
                onChange={handleChange}
                error={!!errors.contactEmail}
                disabled={isLoading}
                aria-describedby={errors.contactEmail ? 'contactEmail-error' : undefined}
              />
              {errors.contactEmail && (
                <p id="contactEmail-error" className="text-sm text-danger">
                  {errors.contactEmail}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">
                전화번호 <span className="text-text-muted font-normal">(선택)</span>
              </Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                placeholder="010-0000-0000"
                autoComplete="tel"
                value={formData.contactPhone ?? ''}
                onChange={handleChange}
                error={!!errors.contactPhone}
                disabled={isLoading}
                aria-describedby={errors.contactPhone ? 'contactPhone-error' : undefined}
              />
              {errors.contactPhone && (
                <p id="contactPhone-error" className="text-sm text-danger">
                  {errors.contactPhone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">
                웹사이트 <span className="text-text-muted font-normal">(선택)</span>
              </Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                placeholder="https://example.com"
                autoComplete="url"
                value={formData.websiteUrl ?? ''}
                onChange={handleChange}
                error={!!errors.websiteUrl}
                disabled={isLoading}
                aria-describedby={errors.websiteUrl ? 'websiteUrl-error' : undefined}
              />
              {errors.websiteUrl && (
                <p id="websiteUrl-error" className="text-sm text-danger">
                  {errors.websiteUrl}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  등록 중...
                </>
              ) : (
                '시작하기'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
