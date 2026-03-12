export const CONTENT_CATEGORIES = [
  '남성패션', '여성패션', '뷰티', '향수', '그루밍',
  'F&B', '테크', '게임', '여행', '라이프스타일',
  '운동/피트니스', '자동차', '인테리어', '육아', '교육',
  '금융', '반려동물', '음악', '영화/드라마', '요리',
] as const;

export const BLOCKED_CATEGORIES = [
  '도박', '성인', '정치', '종교', '담배', '주류',
] as const;

export const PLATFORMS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'naver_blog', label: '네이버 블로그' },
] as const;

export const CONTENT_TYPES = [
  { value: 'branded', label: '브랜디드 콘텐츠' },
  { value: 'ppl', label: 'PPL' },
  { value: 'review', label: '리뷰' },
  { value: 'unboxing', label: '언박싱' },
  { value: 'shorts', label: '쇼츠/릴스' },
  { value: 'other', label: '기타' },
] as const;

export const AUDIENCE_AGE_RANGES = [
  '13-17', '18-24', '25-34', '35-44', '45-54', '55+',
] as const;

export const MATCH_STATUS_LABELS: Record<string, string> = {
  pending: '대기 중',
  viewed: '확인됨',
  accepted: '수락됨',
  rejected: '거절됨',
  negotiating: '협상 중',
  contracted: '계약됨',
};

export const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  draft: '초안',
  active: '진행 중',
  paused: '일시중지',
  completed: '완료',
  cancelled: '취소됨',
};

export const BUSINESS_CATEGORIES = [
  'IT/소프트웨어', '패션/의류', '뷰티/화장품', '식품/음료',
  '건강/피트니스', '여행/관광', '교육/학습', '금융/보험',
  '부동산', '자동차', '가전/전자기기', '엔터테인먼트',
  '게임', '유통/이커머스', '생활용품', '반려동물',
  '인테리어/가구', '스포츠', '미디어/출판', '기타',
] as const;

export const TRUST_SCORE_CONFIG = {
  initial: 36.5,
  warning: 33.0,
  restricted: 30.0,
} as const;
