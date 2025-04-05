export interface BookDto {
  _id: string;
  title: string;
  author: string;
  summary?: string;
  keyPoints?: string[];
  description?: string;
  coverImage?: string;
  isSummarized: boolean;
  categories?: string[];
  publishedYear?: number;
  publisher?: string;
  isbn?: string;
} 