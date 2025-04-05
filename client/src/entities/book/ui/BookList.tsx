import React from 'react';
import Link from 'next/link';
import { BookDto } from '@/entities/book/model/types';
import BookCard from './BookCard';


interface BookListProps {
  books: BookDto[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  if (books.length === 0) {
    return <div className="text-center py-10">책이 없습니다.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book, index) => (
        <Link key={`${book._id}-${index}`} href={`/book/${book._id}`} passHref>
          <BookCard book={book} />
        </Link>
      ))}
    </div>
  );
};

export default BookList; 