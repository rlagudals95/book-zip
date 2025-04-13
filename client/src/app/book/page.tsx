import BookPage from "@/pages/book/BookPage";
import Layout from "@/widgets/layout/ui/Layout";

interface PageProps {
  searchParams: Promise<{
    page: string;
  }>;
}

export default async function BookDetailPage({ searchParams }: PageProps) {

  const params = await searchParams;

  return (
    <Layout>
      <BookPage searchParams={params} />
    </Layout>
  );
}