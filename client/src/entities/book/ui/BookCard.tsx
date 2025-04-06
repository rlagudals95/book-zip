import React from 'react';
import { BookDto } from '@/entities/book/model/types';

interface BookCardProps {
  book: BookDto;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="relative aspect-[1/1] w-full bg-gray-100">
        {book.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- 이미지 출처
          <img
            src={book.coverImage}
            alt={book.title}        
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">이미지 없음</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow">
        <h3 className="font-bold text-lg line-clamp-2 mb-1">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        
        {book.isSummarized && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            요약본 있음
          </span>
        )}
      </div>
    </div>
  );
};

export default BookCard; 