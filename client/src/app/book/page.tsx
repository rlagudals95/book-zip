import BookPage from "@/pages/book/BookPage";
import Layout from "@/widgets/layout/ui/Layout";


export default function BookDetailPage({ searchParams }: { searchParams: { page: string } }) {
  return (
    <Layout>
      <BookPage searchParams={searchParams} />
    </Layout>
  );
}