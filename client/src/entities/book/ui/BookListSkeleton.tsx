import React from 'react';

interface BookListSkeletonProps {
  count: number;
}

const BookListSkeleton: React.FC<BookListSkeletonProps> = ({ count }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border rounded-lg overflow-hidden shadow-md animate-pulse">
          <div className="aspect-[2/3] w-full bg-gray-200" />
          <div className="p-4">
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookListSkeleton; 