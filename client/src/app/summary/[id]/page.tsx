'use client';

import { SummaryDetailPage } from "@/pages/summary";

export default function SummaryDetail({ params }: { params: { id: string } }) {
  return <SummaryDetailPage summaryId={params.id} />;
} 