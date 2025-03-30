'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export const Header = ({ isAuthenticated = false }: HeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleLogout = () => {
    toast.success("로그아웃되었습니다.");
    router.push('/');
  };

  return (
    <header className="border-b">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          매일 Book Zip
        </Link>
        <nav className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link 
                href="/dashboard" 
                className={pathname === '/dashboard' ? "font-medium text-primary" : "hover:text-primary"}
              >
                대시보드
              </Link>
              <Link 
                href="/library" 
                className={pathname === '/library' ? "font-medium text-primary" : "hover:text-primary"}
              >
                나의 서재
              </Link>
              <Link 
                href="/settings" 
                className={pathname === '/settings' ? "font-medium text-primary" : "hover:text-primary"}
              >
                설정
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </nav>
      </div>
    </header>
  );
}; 