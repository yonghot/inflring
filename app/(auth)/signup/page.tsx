'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Video, Megaphone, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { signupSchema } from '@/lib/validations';
import type { SignupInput } from '@/lib/validations';
import type { ApiResponse, Profile } from '@/lib/types';
import { cn } from '@/lib/utils';
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

type RoleOption = 'creator' | 'brand';

interface SignupResponseData {
  user: { id: string; email: string };
  profile: Profile;
}

const ONBOARDING_ROUTES: Record<RoleOption, string> = {
  creator: '/creator/onboarding',
  brand: '/brand/onboarding',
};

const ROLE_OPTIONS: { value: RoleOption; label: string; description: string; icon: typeof Video }[] = [
  {
    value: 'creator',
    label: '크리에이터',
    description: '콘텐츠를 만들고 광고를 수주합니다',
    icon: Video,
  },
  {
    value: 'brand',
    label: '광고주',
    description: '크리에이터에게 광고를 의뢰합니다',
    icon: Megaphone,
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupInput>({
    email: '',
    password: '',
    displayName: '',
    role: '' as SignupInput['role'],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupInput, string>>>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  }

  function handleRoleSelect(role: RoleOption) {
    setFormData((prev) => ({ ...prev, role }));
    setErrors((prev) => ({ ...prev, role: undefined }));
    setServerError('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError('');

    if (!agreedToTerms) {
      setServerError('이용약관 및 개인정보 처리방침에 동의해주세요.');
      return;
    }

    const parsed = signupSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof SignupInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof SignupInput;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const result: ApiResponse<SignupResponseData> = await response.json();

      if (!result.success) {
        setServerError(result.error ?? '회원가입에 실패했습니다');
        setIsLoading(false);
        return;
      }

      const role = parsed.data.role as RoleOption;
      router.push(ONBOARDING_ROUTES[role]);
    } catch {
      setServerError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  }

  // Password strength indicator
  const passwordLength = formData.password.length;
  const passwordStrength =
    passwordLength === 0
      ? 0
      : passwordLength < 6
        ? 1
        : passwordLength < 10
          ? 2
          : 3;
  const strengthLabels = ['', '약함', '보통', '강함'];
  const strengthColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-green-500'];

  return (
    <Card className="w-full max-w-md hover:shadow-sm hover:translate-y-0">
      <CardHeader className="text-center pb-2">
        <p className="text-2xl font-bold text-primary mb-2">인플링</p>
        <CardTitle className="text-xl">회원가입</CardTitle>
        <CardDescription>인플링에 가입하고 시작하세요</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-5">
          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Role selection */}
          <div className="space-y-2">
            <Label>역할 선택</Label>
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.role === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleRoleSelect(option.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-200',
                      'hover:border-primary/50 hover:bg-primary/5',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-white text-text-secondary'
                    )}
                    aria-pressed={isSelected}
                    disabled={isLoading}
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        isSelected ? 'bg-primary/10' : 'bg-slate-100'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          isSelected ? 'text-primary' : 'text-text-muted'
                        )}
                      />
                    </div>
                    <span className="text-sm font-semibold">{option.label}</span>
                    <span className="text-xs leading-tight">{option.description}</span>
                  </button>
                );
              })}
            </div>
            {errors.role && (
              <p className="flex items-center gap-1 text-sm text-danger">
                <AlertCircle size={14} aria-hidden="true" />
                {errors.role}
              </p>
            )}
          </div>

          {/* Display name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">이름</Label>
            <Input
              id="displayName"
              name="displayName"
              type="text"
              placeholder="이름을 입력하세요"
              autoComplete="name"
              value={formData.displayName}
              onChange={handleChange}
              error={!!errors.displayName}
              disabled={isLoading}
              className="h-12"
              aria-describedby={errors.displayName ? 'displayName-error' : undefined}
            />
            {errors.displayName && (
              <p id="displayName-error" className="flex items-center gap-1 text-sm text-danger">
                <AlertCircle size={14} aria-hidden="true" />
                {errors.displayName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              disabled={isLoading}
              className="h-12"
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
            />
            {errors.email && (
              <p id="signup-email-error" className="flex items-center gap-1 text-sm text-danger">
                <AlertCircle size={14} aria-hidden="true" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="6자 이상 입력하세요"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                disabled={isLoading}
                className="h-12 pr-11"
                aria-describedby={errors.password ? 'signup-password-error' : 'password-hint'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Password strength */}
            {passwordLength > 0 && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        'h-1 flex-1 rounded-full transition-colors',
                        passwordStrength >= level
                          ? strengthColors[passwordStrength]
                          : 'bg-slate-200'
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-text-muted">
                  비밀번호 강도: {strengthLabels[passwordStrength]}
                </p>
              </div>
            )}
            {errors.password && (
              <p id="signup-password-error" className="flex items-center gap-1 text-sm text-danger">
                <AlertCircle size={14} aria-hidden="true" />
                {errors.password}
              </p>
            )}
            {!errors.password && passwordLength === 0 && (
              <p id="password-hint" className="text-xs text-text-muted">
                영문, 숫자 포함 6자 이상을 권장합니다
              </p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={agreedToTerms}
              onClick={() => setAgreedToTerms((prev) => !prev)}
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                agreedToTerms
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white'
              )}
            >
              {agreedToTerms && <Check size={14} strokeWidth={3} />}
            </button>
            <p className="text-xs text-text-secondary leading-relaxed">
              <button
                type="button"
                className="text-primary hover:underline font-medium"
                onClick={() => {}}
              >
                이용약관
              </button>
              {' 및 '}
              <button
                type="button"
                className="text-primary hover:underline font-medium"
                onClick={() => {}}
              >
                개인정보 처리방침
              </button>
              에 동의합니다
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex-col space-y-4">
          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                가입 중...
              </>
            ) : (
              '회원가입'
            )}
          </Button>

          {/* Social login placeholders */}
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-text-muted">또는</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-slate-50 transition-colors"
              disabled
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-[#FEE500] px-4 py-2.5 text-sm font-medium text-[#191919] hover:bg-[#FDD800] transition-colors"
              disabled
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M12 3C6.48 3 2 6.48 2 10.8c0 2.78 1.86 5.22 4.66 6.6-.15.54-.97 3.46-1 3.6 0 .05.02.1.06.13a.12.12 0 0 0 .1.02c.14-.02 3.26-2.14 3.78-2.5.78.12 1.58.18 2.4.18 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"
                  fill="#191919"
                />
              </svg>
              Kakao
            </button>
          </div>

          <p className="text-sm text-text-secondary text-center">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              로그인
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
