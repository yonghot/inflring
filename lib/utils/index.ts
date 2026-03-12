import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}만`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}천`;
  }
  return num.toString();
}

export function detectPlatform(url: string): string | null {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('blog.naver.com')) return 'naver_blog';
  return null;
}

export function getTrustScoreColor(score: number): string {
  if (score >= 38) return 'text-green-600';
  if (score >= 36) return 'text-blue-600';
  if (score >= 33) return 'text-yellow-600';
  return 'text-red-600';
}
