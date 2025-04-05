import Link from "next/link";
import { Header } from "@/widgets/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <Header />
      
      {children}

      {/* 푸터 */}
      <footer className="border-t py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">매일 Book Zip</h3>
              <p className="text-muted-foreground">매일매일 책 한 권의 요약본을 받아보세요. 관심사에 맞는 독서를 매일 구독해서 요약본으로 받아볼 수 있는 서비스입니다.</p>
            </div>
            <div>
              {/* <h3 className="text-lg font-bold mb-4">서비스</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">서비스 소개</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">구독 플랜</Link></li>
                <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">자주 묻는 질문</Link></li>
              </ul> */}
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
              <p className="text-muted-foreground mb-2">이메일: dbfudgudals95@gmail.com</p>
              <p className="text-muted-foreground mb-4">전화: 010-5485-9059</p>
              {/* <div className="flex gap-4 justify-center md:justify-start">
                <a href="#" aria-label="페이스북" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" aria-label="트위터" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" aria-label="인스타그램" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
              </div> */}
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
