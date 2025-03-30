'use client';

import { SummaryList } from "@/widgets/summaryList";
import { UserProfile } from "@/widgets/profile";
import { Header } from "@/widgets/header";
import { MOCK_USER } from "@/entities/user/model/mocks";
import { MOCK_SUMMARIES } from "@/entities/book/model/mocks";

export const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} />
      
      {/* 메인 콘텐츠 */}
      <main className="container mx-auto py-8">
        <UserProfile user={MOCK_USER} />
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">최근 책 요약</h2>
          <SummaryList summaries={MOCK_SUMMARIES} showViewAllButton={true} />
        </div>
      </main>
    </div>
  );
}; 