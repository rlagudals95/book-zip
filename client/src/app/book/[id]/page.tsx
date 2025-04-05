import { getBook } from "@/entities/book/api/book";
import BookDetailPage from "@/pages/book/ui/BookDetailPage";
import { notFound } from "next/navigation";

export default async function BookDetail({ params }: { params: { id: string } }) {

  const { id } = await params;

  if (!id) {
    notFound();
  }

  const book = await getBook(id);

  return <BookDetailPage bookId={book._id}/>
}