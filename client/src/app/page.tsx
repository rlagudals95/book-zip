import { SERVICE_NAME } from "@/shared/const";
import { SubscriptionButton } from "@/shared/ui/subscription-button/subscription-button";
import Layout from "@/widgets/layout/ui/Layout";

export default function Home() {
  return (
    <Layout>
      {/* 히어로 섹션 */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              매일매일 책 한 권의<br />
              <span className="text-primary">요약본</span>을 받아보세요
            </h1>
            <p className="text-lg text-muted-foreground">
              관심사에 맞는 독서를 매일 구독해서 요약본으로 받아볼 수 있는 서비스입니다.
              바쁜 일상 속에서도 책의 핵심만 쏙쏙 챙겨가세요.
            </p>
            <SubscriptionButton />
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{SERVICE_NAME}의 특징</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <div className="p-6 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" x2="21" y1="9" y2="9"></line><line x1="9" x2="9" y1="21" y2="9"></line></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">핵심 요약본</h3>
              <p className="text-muted-foreground text-center">책의 핵심 내용만 요약하여 5분 내로 읽을 수 있게 제공합니다. 효율적인 지식 습득이 가능해요.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="13" x="3" y="4" rx="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">매일 배송</h3>
              <p className="text-muted-foreground text-center">매일 아침 이메일로 요약본을 받아볼 수 있어요. 출근길이나 아침 시간에 독서 습관을 만들어보세요.</p>
            </div>
            {/* TODO: 준비중 */}
            <div className="p-6 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow opacity-50">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">맞춤형 책 추천(준비중)</h3>
              <p className="text-muted-foreground text-center">개인 관심사에 맞는 책을 추천해드려요. 개발, 자기계발, 경제, 철학 등 다양한 분야에서 선별합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">지금 시작하세요</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {SERVICE_NAME}과 함께 효율적인 독서 습관을 만들어보세요.
            {/* 첫 14일 무료 체험 후 만족하지 못하시면 언제든지 구독을 취소할 수 있습니다. */}
          </p>
          <SubscriptionButton />
        </div>
      </section>
    </Layout>
  );
}
