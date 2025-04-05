
import Link from "next/link";



interface HeaderProps {
  isAuthenticated?: boolean;
}

export const Header = ({  }: HeaderProps) => {
  

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          매일 Book Zip
        </Link>
        <nav className="flex gap-4 items-center">
          <Link 
            href="/book" 
            className={ "font-medium text-primary"}
          >
            책목록
          </Link>
          {/* 
          <Link 
            href="/library" 
            className={"font-medium text-primary"}
          >
            나의 서재
          </Link> */}
          {/* <Link 
            href="/settings" 
            className={"font-medium text-primary"}
          >
            설정
          </Link> */}
        </nav>
      </div>
    </header>
  );
}; 