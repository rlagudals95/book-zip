import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="border-b">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            매일 Book Zip
          </Link>
          <nav className="flex gap-4 items-center">
            <Link href="/about" className="hover:text-primary">
              서비스 소개
            </Link>
            <Link href="/pricing" className="hover:text-primary">
              구독 플랜
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                로그인
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                회원가입
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              매일매일 책 한 권의<br />
              <span className="text-primary">요약본</span>을 받아보세요
            </h1>
            <p className="text-lg text-muted-foreground">
              관심사에 맞는 독서를 매일 구독해서 요약본으로 받아볼 수 있는 서비스입니다.
              바쁜 일상 속에서도 책의 핵심만 쏙쏙 챙겨가세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  더 알아보기
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/hero-image.jpg" 
              alt="책을 읽는 사람들"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">매일 Book Zip의 특징</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">맞춤형 책 추천</h3>
              <p className="text-muted-foreground">개인 관심사에 맞는 책을 추천해드려요. 개발, 자기계발, 경제, 철학 등 다양한 분야에서 선별합니다.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" x2="21" y1="9" y2="9"></line><line x1="9" x2="9" y1="21" y2="9"></line></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">핵심 요약본</h3>
              <p className="text-muted-foreground">책의 핵심 내용만 요약하여 5분 내로 읽을 수 있게 제공합니다. 효율적인 지식 습득이 가능해요.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="13" x="3" y="4" rx="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">매일 배송</h3>
              <p className="text-muted-foreground">매일 아침 이메일로 요약본을 받아볼 수 있어요. 출근길이나 아침 시간에 독서 습관을 만들어보세요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">지금 시작하세요</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            매일 Book Zip과 함께 효율적인 독서 습관을 만들어보세요.
            첫 14일 무료 체험 후 만족하지 못하시면 언제든지 구독을 취소할 수 있습니다.
          </p>
          <Link href="/register">
            <Button size="lg">
              14일 무료 체험 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t py-12 bg-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">매일 Book Zip</h3>
              <p className="text-muted-foreground">매일매일 책 한 권의 요약본을 받아보세요. 관심사에 맞는 독서를 매일 구독해서 요약본으로 받아볼 수 있는 서비스입니다.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">서비스</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">서비스 소개</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">구독 플랜</Link></li>
                <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">자주 묻는 질문</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">이용안내</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">이용약관</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">개인정보처리방침</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">고객센터</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">연락처</h3>
              <p className="text-muted-foreground mb-2">이메일: support@mailbookzip.com</p>
              <p className="text-muted-foreground mb-4">전화: 02-123-4567</p>
              <div className="flex gap-4">
                <a href="#" aria-label="페이스북" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" aria-label="트위터" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" aria-label="인스타그램" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} 매일 Book Zip. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
