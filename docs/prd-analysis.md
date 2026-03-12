# PRD 분석 결과

## 기능 목록

| ID | 기능명 | 우선순위 | 의존 기능 |
|----|--------|----------|-----------|
| F-001 | 회원가입/로그인 | P0 | 없음 |
| F-002 | 크리에이터 온보딩 | P0 | F-001 |
| F-003 | 광고주 온보딩 | P0 | F-001 |
| F-004 | 크리에이터 프로필/광고 수용 | P0 | F-002 |
| F-005 | 캠페인 등록 | P0 | F-003 |
| F-006 | 인플루언서 검색 | P0 | F-002 |
| F-007 | 원클릭 제안 | P0 | F-005, F-006 |
| F-008 | 캠페인 피드 + 지원 | P0 | F-002, F-005 |
| F-009 | 딜 목록/상세 | P0 | F-007, F-008 |
| F-010 | 랜딩 페이지 | P0 | 없음 |
| F-011 | 관리자 대시보드 | P0 | F-001 |
| F-012 | 계약서 템플릿 빌더 | P1 | F-009 |
| F-013 | 인앱 메시징 | P1 | F-007, F-008 |
| F-014 | 역제안 | P1 | F-002, F-005 |
| F-015 | 신뢰 온도 시스템 | P1 | F-009 |
| F-016 | 에스크로 결제 | P2 | F-012 |
| F-017 | 콘텐츠 검수 | P2 | F-012 |
| F-018 | 성과 리포트 | P2 | F-017 |
| F-019 | AI 매칭 엔진 | P2 | F-005, F-002 |

## P0 상세 분석

### F-001: 회원가입/로그인 (Supabase Auth)
- **AC 1**: 이메일+비밀번호로 회원가입 시 profiles 테이블에 역할과 함께 레코드 생성.
- **AC 2**: 로그인 성공 시 역할별 대시보드 리다이렉트 (creator → /creator/dashboard, brand → /brand/dashboard, admin → /admin/dashboard).
- **AC 3**: 비로그인 사용자는 인증 필요 페이지 접근 시 /login으로 리다이렉트.
- **AC 4**: 잘못된 인증 정보 입력 시 명확한 에러 메시지 표시.
- **필요 테이블**: profiles
- **필요 API**: POST /api/auth/signup, POST /api/auth/login, GET /api/auth/me
- **필요 UI**: LoginPage, SignupPage (역할 선택 UI), AuthGuard

### F-002: 크리에이터 온보딩
- **AC 1**: 채널 URL 입력 시 플랫폼(youtube/instagram/tiktok/naver_blog) 자동 감지.
- **AC 2**: creators 테이블에 채널 정보 저장 (channel_name, channel_url, platform).
- **AC 3**: 온보딩 완료 후 /creator/dashboard로 이동.
- **AC 4**: [PROD-TODO] YouTube API 연동 전까지 목업 데이터로 subscribers, avg_views 등 생성.
- **필요 테이블**: creators
- **필요 API**: POST /api/creators
- **필요 UI**: CreatorOnboardingPage

### F-003: 광고주 온보딩
- **AC 1**: brands 테이블에 회사 정보(company_name, business_category, contact_*) 저장.
- **AC 2**: 온보딩 완료 후 /brand/dashboard로 이동.
- **AC 3**: 대시보드에 적합 인플루언서 추천 목록 표시 (MVP: 카테고리 매칭).
- **필요 테이블**: brands
- **필요 API**: POST /api/brands
- **필요 UI**: BrandOnboardingPage

### F-004: 크리에이터 프로필/광고 수용 상태 관리
- **AC 1**: 광고 가능/불가 토글(is_available) 동작.
- **AC 2**: 희망 단가 범위(min_price/max_price) 설정.
- **AC 3**: 선호/불가 카테고리 멀티셀렉트 설정.
- **AC 4**: 월간 최대 수용 건수, 수정 횟수 제한, 자율권 설정.
- **필요 테이블**: creators (업데이트)
- **필요 API**: PATCH /api/creators/[id]
- **필요 UI**: CreatorProfileEditPage

### F-005: 캠페인 등록
- **AC 1**: 필수 입력: 제목, 설명, 콘텐츠 유형, 플랫폼, 예산 범위.
- **AC 2**: campaigns 테이블에 status='active'로 저장.
- **AC 3**: 캠페인 목록에서 다른 사용자가 조회 가능.
- **필요 테이블**: campaigns
- **필요 API**: POST /api/campaigns, GET /api/campaigns
- **필요 UI**: CampaignNewPage, CampaignListPage

### F-006: 인플루언서 검색
- **AC 1**: 카테고리, 구독자 범위, 플랫폼 필터 동작.
- **AC 2**: is_available=true인 크리에이터만 노출.
- **AC 3**: 검색 결과에서 인플루언서 상세 프로필로 이동.
- **필요 테이블**: creators (조회)
- **필요 API**: GET /api/creators (쿼리 파라미터 필터)
- **필요 UI**: CreatorSearchPage, CreatorDetailPage

### F-007: 원클릭 제안
- **AC 1**: '제안하기' 클릭 → 캠페인 선택 모달.
- **AC 2**: matches 테이블에 direction='brand_direct_offer' 생성.
- **AC 3**: 상태 'pending'으로 시작.
- **필요 테이블**: matches
- **필요 API**: POST /api/matches
- **필요 UI**: ProposalModal (캠페인 선택)

### F-008: 캠페인 피드 + 지원
- **AC 1**: active 상태 캠페인만 피드에 노출.
- **AC 2**: '지원하기' → matches 테이블에 direction='creator_apply' 생성.
- **AC 3**: 중복 지원 시 에러 메시지.
- **필요 테이블**: matches
- **필요 API**: POST /api/matches, GET /api/campaigns
- **필요 UI**: CampaignFeedPage, CampaignDetailPage (지원 버튼)

### F-009: 딜 목록/상세
- **AC 1**: 내 매칭/계약 목록 상태별 필터링.
- **AC 2**: 딜 상세에서 매칭 정보, 계약 상태 확인.
- **AC 3**: 매칭 수락/거절 액션.
- **필요 테이블**: matches (조회/업데이트)
- **필요 API**: GET /api/matches, PATCH /api/matches/[id]
- **필요 UI**: DealListPage, DealDetailPage

### F-010: 랜딩 페이지
- **AC 1**: 히어로 섹션 (대형 타이틀 + 서브카피 + CTA).
- **AC 2**: 서비스 특징/가치 소개 섹션.
- **AC 3**: 회원가입/로그인 CTA 동작.
- **AC 4**: 반응형 + 마이크로 인터랙션 (페이드인).
- **필요 UI**: LandingPage (히어로, 기능소개, CTA, 풋터)

### F-011: 관리자 대시보드
- **AC 1**: 총 사용자/캠페인/매칭 수 표시.
- **AC 2**: admin 역할만 접근.
- **AC 3**: 최근 활동 목록 표시.
- **필요 API**: GET /api/admin/stats
- **필요 UI**: AdminDashboardPage

## 의존 관계 매트릭스

| 기능 | 선행 조건 | 후행 기능 |
|------|-----------|-----------|
| F-001 회원가입/로그인 | 없음 | F-002, F-003, F-011 |
| F-002 크리에이터 온보딩 | F-001 | F-004, F-006, F-008 |
| F-003 광고주 온보딩 | F-001 | F-005 |
| F-004 프로필/광고 수용 | F-002 | - |
| F-005 캠페인 등록 | F-003 | F-007, F-008 |
| F-006 인플루언서 검색 | F-002 | F-007 |
| F-007 원클릭 제안 | F-005, F-006 | F-009 |
| F-008 캠페인 지원 | F-002, F-005 | F-009 |
| F-009 딜 목록/상세 | F-007, F-008 | - |
| F-010 랜딩 페이지 | 없음 | - |
| F-011 관리자 대시보드 | F-001 | - |

## 구현 순서 (의존성 기반)

1. **Layer 0**: F-010 (랜딩), F-001 (인증) — 독립
2. **Layer 1**: F-002 (크리에이터 온보딩), F-003 (광고주 온보딩) — F-001 의존
3. **Layer 2**: F-004 (프로필), F-005 (캠페인), F-006 (검색), F-011 (관리자) — Layer 1 의존
4. **Layer 3**: F-007 (제안), F-008 (지원) — Layer 2 의존
5. **Layer 4**: F-009 (딜 관리) — Layer 3 의존

## [PROD-TODO] 요약

| 항목 | MVP 대체 | 프로덕션 전환 |
|------|----------|---------------|
| YouTube Data API v3 | 목업 데이터 (subscribers, avg_views 등) | 실제 API 연동 |
| Instagram Graph API | 미구현 | API 연동 |
| Claude API 매칭 | 카테고리 기반 단순 매칭 | AI 매칭 점수 산출 |
| Claude API 독소조항 | 미구현 | 계약서 분석 |
| Toss Payments 에스크로 | 미구현 | PG 연동 |
| Supabase Realtime 채팅 | 페이지 리프레시/폴링 | 실시간 구독 |
| 미디어킷 PDF | 미구현 | Puppeteer/react-pdf |
| 성과 리포트 자동추적 | 수동 입력 | API 자동 수집 |
| admin 시드 계정 | admin@admin.com / admin123! | 보안 강화 (환경변수) |
