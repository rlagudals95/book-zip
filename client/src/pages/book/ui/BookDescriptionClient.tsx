'use client';

import React, { useState } from 'react';

interface BookDescriptionClientProps {
  description?: string;
}

const BookDescriptionClient: React.FC<BookDescriptionClientProps> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold">
          책 소개
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
          aria-expanded={isExpanded}
          aria-controls="book-description"
        >
          {isExpanded ? (
            <>
              접기
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              더 보기
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>
      <div 
        id="book-description"
        className={`prose prose-blue max-w-none overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[1000px]' : 'max-h-24'
        }`}
      >
        <p className="text-gray-700 whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BookDescriptionClient; 