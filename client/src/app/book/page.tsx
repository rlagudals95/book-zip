import BookPage from "@/pages/book/BookPage";
import Layout from "@/widgets/layout/ui/Layout";


export default async function BookDetailPage({ searchParams }: { searchParams: { page: string } }) {

  const params = await searchParams;

  return (
    <Layout>
      <BookPage searchParams={params} />
    </Layout>
  );
}