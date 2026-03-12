import { describe, it, expect } from 'vitest';
import {
  cn,
  formatCurrency,
  formatNumber,
  detectPlatform,
  getTrustScoreColor,
} from '@/lib/utils';

// ---------------------------------------------------------------------------
// cn() - Tailwind class merging
// ---------------------------------------------------------------------------
describe('cn', () => {
  it('merges multiple class names', () => {
    const result = cn('px-2', 'py-1');
    expect(result).toBe('px-2 py-1');
  });

  it('handles conflicting Tailwind classes by keeping the last one', () => {
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const result = cn('base', isActive && 'active');
    expect(result).toContain('active');
  });

  it('handles falsy values gracefully', () => {
    const result = cn('base', false, null, undefined, 'extra');
    expect(result).toBe('base extra');
  });

  it('returns empty string for no arguments', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('deduplicates identical classes', () => {
    const result = cn('text-red-500', 'text-red-500');
    expect(result).toBe('text-red-500');
  });

  it('handles array arguments via clsx', () => {
    const result = cn(['px-2', 'py-1']);
    expect(result).toBe('px-2 py-1');
  });

  it('merges conflicting color classes', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });
});

// ---------------------------------------------------------------------------
// formatCurrency() - Korean Won formatting
// ---------------------------------------------------------------------------
describe('formatCurrency', () => {
  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('formats a standard amount with Korean Won symbol', () => {
    const result = formatCurrency(50000);
    // Intl formats KRW with the Won sign
    expect(result).toMatch(/50,000/);
  });

  it('formats large amounts with comma separation', () => {
    const result = formatCurrency(1000000);
    expect(result).toMatch(/1,000,000/);
  });

  it('formats small amounts', () => {
    const result = formatCurrency(100);
    expect(result).toMatch(/100/);
  });

  it('includes currency indicator', () => {
    const result = formatCurrency(10000);
    // KRW format includes the Won sign (₩)
    expect(result).toMatch(/₩/);
  });

  it('handles negative amounts', () => {
    const result = formatCurrency(-50000);
    expect(result).toMatch(/50,000/);
  });
});

// ---------------------------------------------------------------------------
// formatNumber() - Korean number formatting (만, 천)
// ---------------------------------------------------------------------------
describe('formatNumber', () => {
  it('returns plain number string below 1000', () => {
    expect(formatNumber(999)).toBe('999');
  });

  it('returns plain number string for 0', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('returns plain number string for 500', () => {
    expect(formatNumber(500)).toBe('500');
  });

  it('formats 1000 as 천 unit', () => {
    const result = formatNumber(1000);
    expect(result).toBe('1.0천');
  });

  it('formats 5500 as 천 unit', () => {
    const result = formatNumber(5500);
    expect(result).toBe('5.5천');
  });

  it('formats 9999 as 천 unit (below 10000)', () => {
    const result = formatNumber(9999);
    expect(result).toContain('천');
  });

  it('formats 10000 as 만 unit', () => {
    const result = formatNumber(10000);
    expect(result).toBe('1.0만');
  });

  it('formats 50000 as 만 unit', () => {
    const result = formatNumber(50000);
    expect(result).toBe('5.0만');
  });

  it('formats 123456 as 만 unit', () => {
    const result = formatNumber(123456);
    expect(result).toBe('12.3만');
  });

  it('formats 1000000 as 만 unit', () => {
    const result = formatNumber(1000000);
    expect(result).toBe('100.0만');
  });

  it('uses 만 threshold over 천 when >= 10000', () => {
    // 10000 should be "1.0만" not "10.0천"
    expect(formatNumber(10000)).toBe('1.0만');
  });

  it('handles boundary at 999 (no unit)', () => {
    expect(formatNumber(999)).toBe('999');
  });

  it('handles boundary at 1000 (천 unit)', () => {
    expect(formatNumber(1000)).toBe('1.0천');
  });
});

// ---------------------------------------------------------------------------
// detectPlatform() - URL to platform detection
// ---------------------------------------------------------------------------
describe('detectPlatform', () => {
  it('detects YouTube from youtube.com URL', () => {
    expect(detectPlatform('https://www.youtube.com/@channel')).toBe('youtube');
  });

  it('detects YouTube from youtu.be short URL', () => {
    expect(detectPlatform('https://youtu.be/abc123')).toBe('youtube');
  });

  it('detects Instagram', () => {
    expect(detectPlatform('https://www.instagram.com/user')).toBe('instagram');
  });

  it('detects TikTok', () => {
    expect(detectPlatform('https://www.tiktok.com/@user')).toBe('tiktok');
  });

  it('detects Naver Blog', () => {
    expect(detectPlatform('https://blog.naver.com/username')).toBe('naver_blog');
  });

  it('returns null for unknown platforms', () => {
    expect(detectPlatform('https://twitter.com/user')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(detectPlatform('')).toBeNull();
  });

  it('returns null for random text', () => {
    expect(detectPlatform('hello world')).toBeNull();
  });

  it('detects platform from URL with query parameters', () => {
    expect(detectPlatform('https://youtube.com/watch?v=abc123')).toBe('youtube');
  });

  it('detects platform from URL with path segments', () => {
    expect(detectPlatform('https://instagram.com/p/abc123/likes')).toBe('instagram');
  });

  it('handles URLs without https prefix', () => {
    // The function uses includes(), so it works without protocol
    expect(detectPlatform('youtube.com/watch?v=x')).toBe('youtube');
  });

  it('handles URL with http prefix', () => {
    expect(detectPlatform('http://tiktok.com/@user')).toBe('tiktok');
  });

  it('does not detect partial matches for naver blog', () => {
    // "naver.com" without "blog." prefix should not match
    expect(detectPlatform('https://naver.com')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getTrustScoreColor() - Score to Tailwind color mapping
// ---------------------------------------------------------------------------
describe('getTrustScoreColor', () => {
  it('returns green for score >= 38', () => {
    expect(getTrustScoreColor(38)).toBe('text-green-600');
  });

  it('returns green for score well above 38', () => {
    expect(getTrustScoreColor(45)).toBe('text-green-600');
  });

  it('returns blue for score >= 36 and < 38', () => {
    expect(getTrustScoreColor(36)).toBe('text-blue-600');
  });

  it('returns blue for score 37', () => {
    expect(getTrustScoreColor(37)).toBe('text-blue-600');
  });

  it('returns blue for score 37.99', () => {
    expect(getTrustScoreColor(37.99)).toBe('text-blue-600');
  });

  it('returns yellow for score >= 33 and < 36', () => {
    expect(getTrustScoreColor(33)).toBe('text-yellow-600');
  });

  it('returns yellow for score 35', () => {
    expect(getTrustScoreColor(35)).toBe('text-yellow-600');
  });

  it('returns yellow for score 35.99', () => {
    expect(getTrustScoreColor(35.99)).toBe('text-yellow-600');
  });

  it('returns red for score < 33', () => {
    expect(getTrustScoreColor(32)).toBe('text-red-600');
  });

  it('returns red for score 0', () => {
    expect(getTrustScoreColor(0)).toBe('text-red-600');
  });

  it('returns red for negative score', () => {
    expect(getTrustScoreColor(-5)).toBe('text-red-600');
  });

  it('returns green for exact boundary 38.0', () => {
    expect(getTrustScoreColor(38.0)).toBe('text-green-600');
  });

  it('returns blue for exact boundary 36.0', () => {
    expect(getTrustScoreColor(36.0)).toBe('text-blue-600');
  });

  it('returns yellow for exact boundary 33.0', () => {
    expect(getTrustScoreColor(33.0)).toBe('text-yellow-600');
  });

  it('returns red for score 32.99', () => {
    expect(getTrustScoreColor(32.99)).toBe('text-red-600');
  });
});
