import { getBook } from "@/entities/book/api/book";
import Layout from "@/widgets/layout/ui/Layout";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from 'react';
import BookDescriptionClient from "./BookDescriptionClient";
import BookSummary from "./BookSummary";

interface BookDetailPageProps {
  bookId: string;
}

export default async function BookDetailPage({ bookId }: BookDetailPageProps) {
  try {

    if (!bookId) {
      return null;
    }

    const book = await getBook(bookId);

    if (!book) {
      return notFound();
    }

    return (
      <Layout>
        <div className="container mx-auto py-8">
          {/* 뒤로가기 버튼 */}
          <div className="mb-6 px-4">
            <Link
              href="/book"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              책 목록으로 돌아가기
            </Link>
          </div>

          <div className="bg-white rounded-lg overflow-hidden w-full">
    
              {/* 책 정보 */}
              <div className="p-6">
                <div className="flex flex-col h-full">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {book.title}
                    </h1>
                    <p className="text-xl text-gray-600 mb-4">{book.author}</p>

                    {/* 상태 표시 */}
                    <div className="flex items-center mb-6">
                      {book.isSummarized && (
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-2">
                          요약본 있음
                        </span>
                      )}
                      {book.publishedYear && (
                        <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                          {book.publishedYear}년 출간
                        </span>
                      )}
                    </div>

                    {/* 요약 정보 (강조) - 별도 컴포넌트로 분리 */}
                    <BookSummary 
                      summary={book.summary} 
                      keyPoints={book.keyPoints} 
                    />

                    {/* 카테고리 */}
                    {book.categories && book.categories.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-2">
                          카테고리
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {book.categories.map((category, index) => (
                            <span
                              key={index}
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 도서 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {book.publisher && (
                        <div>
                          <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold">
                            출판사
                          </h3>
                          <p className="text-gray-700">{book.publisher}</p>
                        </div>
                      )}
                      {book.isbn && (
                        <div>
                          <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold">
                            ISBN
                          </h3>
                          <p className="text-gray-700">{book.isbn}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 책 소개 - 클라이언트 컴포넌트로 분리 */}
                  <Suspense fallback={<div className="animate-pulse h-6 bg-gray-200 rounded w-full"></div>}>
                    <BookDescriptionClient description={book.description} />
                  </Suspense>

                </div>
              </div>
            </div>
          
        </div>
      </Layout>
    );
  } catch (error) {
    console.error("책 데이터를 가져오는 중 오류가 발생했습니다:", error);
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            책 정보를 가져오는데 실패했습니다.
          </div>
          <Link
            href="/book"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            책 목록으로 돌아가기
          </Link>
        </div>
      </Layout>
    );
  }
} 