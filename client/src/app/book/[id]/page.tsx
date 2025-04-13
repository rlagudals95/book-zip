import { getBook } from "@/entities/book/api/book";
import BookDetailPage from "@/pages/book/ui/BookDetailPage";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  const book = await getBook(id);
  if (!book) {
    return notFound();
  }

  return <BookDetailPage bookId={book._id} />;
}