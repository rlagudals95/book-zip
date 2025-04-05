'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const getPageRange = () => {
    const pageRange = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pageRange.push(i);
    }
    
    return pageRange;
  };
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    if (onPageChange) {
      onPageChange(page);
    } else {
      
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set('page', page.toString());
      const newUrl = `${pathname}?${params.toString()}`;
      
      router.push(newUrl);
    }
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <nav className="flex justify-center mt-8 mb-4" aria-label="페이지 내비게이션">
      <ul className="flex items-center space-x-1">
        {/* 첫 페이지 버튼 */}
        <li>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={clsx(
              "px-2 py-2 rounded-md",
              "text-sm font-medium",
              currentPage === 1 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            )}
            aria-label="첫 페이지"
          >
            &laquo;
          </button>
        </li>
        
        {/* 이전 페이지 버튼 */}
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={clsx(
              "px-2 py-2 rounded-md",
              "text-sm font-medium",
              currentPage === 1 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            )}
            aria-label="이전 페이지"
          >
            &lsaquo;
          </button>
        </li>
        
        {/* 페이지 번호 - 페이지 범위 디버깅 로그 */}
        {(() => {
          const pageRange = getPageRange();
          return pageRange.map(page => (
            <li key={page}>
              <button
                onClick={() => handlePageChange(page)}
                className={clsx(
                  "px-4 py-2 rounded-md text-sm font-medium",
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                )}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            </li>
          ));
        })()}
        
        {/* 다음 페이지 버튼 */}
        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={clsx(
              "px-2 py-2 rounded-md",
              "text-sm font-medium",
              currentPage === totalPages 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            )}
            aria-label="다음 페이지"
          >
            &rsaquo;
          </button>
        </li>
        
        {/* 마지막 페이지 버튼 */}
        <li>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={clsx(
              "px-2 py-2 rounded-md",
              "text-sm font-medium",
              currentPage === totalPages 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            )}
            aria-label="마지막 페이지"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination; 