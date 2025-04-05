import { clientFetch } from '@/shared/api';
import { BookDto } from '@/entities/book/model/types';

interface BooksResponse {
  items: BookDto[];
  totalItems: number;
  page: number;
  totalPages: number;
  itemsPerPage: number;
}

export const getBooks = async (page = 1, itemsPerPage = 10) => {
  return clientFetch.get<BooksResponse>(`book?page=${page}&limit=${itemsPerPage}`);
};

export const getBook = (id: string) => {
  return clientFetch.get<BookDto>(`book/${id}`);
};


