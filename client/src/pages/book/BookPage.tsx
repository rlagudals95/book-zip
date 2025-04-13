import { Suspense } from 'react';
import { getBooks } from "@/entities/book/api/book";
import BookListSkeleton from '@/entities/book/ui/BookListSkeleton';
import BookList from '@/entities/book/ui/BookList';
import Pagination from '@/shared/ui/pagenation/Pagination';
import { notFound } from 'next/navigation';

interface BookPageProps {
  searchParams?: {
    page?: string;
  };
}

export default async function BookPage({ searchParams }: BookPageProps) {

  const page = searchParams?.page ? Number(searchParams.page) : 1;

  if (!page) {
    return notFound();
  }

  const currentPage = Number(page);
  const itemsPerPage = 10;

  try {
   
    const booksData = await getBooks(currentPage, itemsPerPage);

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">책 목록</h1>
        
        {/* 페이지 디버깅 정보 */}
        <div className="text-gray-600 mb-4">
          <p>총 {booksData.totalItems}권의 책이 있습니다.</p>
          <p>현재 페이지: {currentPage}, 총 페이지: {booksData.totalPages}</p> 
        </div>
        
        {/* 책 목록 */}
        <Suspense fallback={<BookListSkeleton count={itemsPerPage} />}>
          <BookList books={booksData.items} />
        </Suspense>
        
        {/* 페이지네이션 */}
        <Pagination
          totalItems={booksData.totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
        />
      </div>
    );
  } catch (error) {
    console.error('책 데이터를 가져오는 중 오류가 발생했습니다:', error);
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">책 목록</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          데이터를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.
        </div>
      </div>
    );
  }
}