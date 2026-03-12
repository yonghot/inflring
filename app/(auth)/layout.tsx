export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel - hidden on mobile */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/80 to-blue-900/90" />
        <div className="relative z-10 max-w-md px-12 text-white">
          <h1 className="text-4xl font-bold mb-4">인플링</h1>
          <p className="text-xl text-white/90 leading-relaxed mb-6">
            크리에이터와 브랜드를 연결하는
            <br />
            스마트 인플루언서 매칭 플랫폼
          </p>
          <div className="space-y-4 text-white/70">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <span className="text-sm font-bold">1</span>
              </div>
              <span>AI 기반 매칭으로 최적의 파트너 발견</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <span className="text-sm font-bold">2</span>
              </div>
              <span>안전한 에스크로 결제 시스템</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <span className="text-sm font-bold">3</span>
              </div>
              <span>신뢰 온도 기반 투명한 평판 관리</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-slate-50">
        {children}
      </div>
    </div>
  );
}
