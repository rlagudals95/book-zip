import { useEffect, useState } from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Header } from "@/widgets/header";
import { BookSummary } from "@/entities/summary";

// 임시 데이터 - 실제로는 API에서 가져옵니다
const SUMMARIES: BookSummary[] = [
  {
    id: "1",
    title: "아주 작은 습관의 힘",
    author: "제임스 클리어",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=387&auto=format&fit=crop",
    date: "2024-04-01",
    excerpt: "작은 습관이 모여 큰 변화를 만든다. 이 책은 습관 형성의 과학적 원리와 실천 방법을 알려준다.",
    content: `
      <h2>핵심 요약</h2>
      <p>작은 습관이 모여 큰 변화를 만든다. 이 책은 습관 형성의 과학적 원리와 실천 방법을 알려준다.</p>
      
      <h2>주요 내용</h2>
      <p>1. <strong>1% 더 나아지기</strong>: 매일 1%씩 개선하면 1년 후에는 37배 더 나아진다.</p>
      <p>2. <strong>습관의 4단계</strong>: 신호(Cue), 갈망(Craving), 반응(Response), 보상(Reward)의 과정을 이해하고 활용하라.</p>
      <p>3. <strong>환경 디자인</strong>: 좋은 습관을 들이기 쉽게, 나쁜 습관을 어렵게 만드는 환경을 만들어라.</p>
      <p>4. <strong>습관 쌓기</strong>: 이미 하고 있는 습관에 새로운 습관을 연결하면 새 습관이 더 쉽게 형성된다.</p>
      <p>5. <strong>2분 규칙</strong>: 새로운 습관은 2분 이내에 할 수 있는 것으로 시작하라.</p>
      
      <h2>적용 방법</h2>
      <p>• 습관 추적기를 사용하여 매일 자신의 습관을 기록하고 연속성을 유지하라.</p>
      <p>• 새로운 습관을 형성할 때는 구체적인 시간과 장소를 미리 정해두라.</p>
      <p>• 자신에게 맞는 보상 시스템을 만들어 습관 형성을 촉진하라.</p>
      
      <h2>저자 소개</h2>
      <p>제임스 클리어는 습관 형성과 자기 개선에 관한 전문가로, <a href="#">jamesclear.com</a>의 설립자이다. 그의 뉴스레터는 전 세계 100만 명 이상의 구독자를 보유하고 있다.</p>
    `,
    categories: ["자기계발", "생산성", "심리학"],
    readingTime: "5분",
    publishedYear: 2018
  },
  {
    id: "2",
    title: "함께 자라기",
    author: "김창준",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=387&auto=format&fit=crop",
    date: "2024-04-02",
    excerpt: "애자일과 협력에 대한 생각을 담은 책. 개발자로서 어떻게 성장해야 하는지에 대한 통찰을 제공한다.",
    content: `
      <h2>핵심 요약</h2>
      <p>이 책은 에자일 방법론의 실천적 적용과 개발자의 성장에 대한 통찰을 담고 있다.</p>
      
      <h2>주요 내용</h2>
      <p>1. <strong>학습에 대한 새로운 관점</strong>: 전통적인 학습과 애자일 학습의 차이점을 설명한다.</p>
      <p>2. <strong>협력의 중요성</strong>: 개발 과정에서 협력이 얼마나 중요한지에 대해 설명한다.</p>
      <p>3. <strong>자기계발의 방법</strong>: 개발자로서 지속적으로 성장하는 방법을 제시한다.</p>
      <p>4. <strong>애자일의 실천</strong>: 실제 프로젝트에서 애자일을 적용하는 방법을 설명한다.</p>
      
      <h2>적용 방법</h2>
      <p>• 1인분 이상의 역할을 수행하기 위해 노력하라.</p>
      <p>• 피드백을 구하고 받아들이는 태도를 기르라.</p>
      <p>• 실수를 두려워하지 말고 실험과 학습의 기회로 삼아라.</p>
      
      <h2>저자 소개</h2>
      <p>김창준은 한국의 애자일 코치로, 다양한 기업에서 애자일 방법론을 전파하고 있다.</p>
    `,
    categories: ["개발", "자기계발", "협업"],
    readingTime: "6분",
    publishedYear: 2018
  },
  {
    id: "3",
    title: "사피엔스",
    author: "유발 하라리",
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=387&auto=format&fit=crop",
    date: "2024-04-03",
    excerpt: "인류의 역사를 통찰력 있게 분석한 책. 인간이 어떻게 지구의 지배자가 되었는지 설명한다.",
    content: `
      <h2>핵심 요약</h2>
      <p>인류의 역사를 크게 인지혁명, 농업혁명, 과학혁명으로 나누어 설명하며, 인간이 어떻게 지구의 지배자가 되었는지 탐구한다.</p>
      
      <h2>주요 내용</h2>
      <p>1. <strong>인지혁명</strong>: 약 7만 년 전, 호모 사피엔스가 추상적 사고와 상상력을 갖게 되면서 협력 능력이 향상되었다.</p>
      <p>2. <strong>농업혁명</strong>: 약 1만 2천 년 전, 인류는 농업을 시작했지만 이것이 반드시 더 나은 삶을 가져온 것은 아니었다.</p>
      <p>3. <strong>과학혁명</strong>: 약 500년 전, 인류는 무지를 인정하고 관찰과 실험을 통해 지식을 쌓기 시작했다.</p>
      <p>4. <strong>허구의 힘</strong>: 인간은 공통의 이야기(종교, 국가, 돈 등)를 만들어 대규모 협력을 가능하게 했다.</p>
      
      <h2>적용 방법</h2>
      <p>• 우리가 당연하게 여기는 많은 것들이 사실은 인간이 만든 허구임을 인식하라.</p>
      <p>• 역사적 관점에서 현재 우리 사회의 모습을 비판적으로 바라보라.</p>
      
      <h2>저자 소개</h2>
      <p>유발 하라리는 이스라엘 히브리 대학교의 역사학과 교수로, 세계적인 베스트셀러 작가이다.</p>
    `,
    categories: ["역사", "인류학", "철학"],
    readingTime: "7분",
    publishedYear: 2011
  },
  {
    id: "4",
    title: "심리학이 돈을 말하다",
    author: "모건 하우절",
    coverImage: "https://images.unsplash.com/photo-1551739440-5dd934d3a94a?q=80&w=387&auto=format&fit=crop",
    date: "2024-04-04",
    excerpt: "돈에 대한 우리의 심리를 분석한 책. 부자가 되는 것보다 현명하게 돈을 대하는 방법을 알려준다.",
    content: `
      <h2>핵심 요약</h2>
      <p>이 책은 돈과 관련된 심리적 측면을 다루며, 왜 사람들이 돈에 대해 비합리적인 결정을 내리는지 설명한다.</p>
      
      <h2>주요 내용</h2>
      <p>1. <strong>돈과 행복의 관계</strong>: 돈이 행복에 미치는 영향과 그 한계.</p>
      <p>2. <strong>투자 심리학</strong>: 왜 투자자들이 자주 비합리적인 결정을 내리는가.</p>
      <p>3. <strong>부의 정의</strong>: 진정한 부는 보이는 것보다 보이지 않는 곳에 있다.</p>
      <p>4. <strong>재무적 자유</strong>: 돈의 진정한 가치는 시간과 선택의 자유에 있다.</p>
      
      <h2>적용 방법</h2>
      <p>• 자신의 재정 상태에 맞는 합리적인 목표를 설정하라.</p>
      <p>• 투자할 때 감정적 결정보다는 장기적 관점에서 판단하라.</p>
      <p>• 돈을 목적이 아닌 도구로 바라보는 관점을 기르라.</p>
      
      <h2>저자 소개</h2>
      <p>모건 하우절은 투자와 금융 교육 분야의 작가로, 금융에 대한 심리적 접근을 중시한다.</p>
    `,
    categories: ["경제", "심리학", "자기계발"],
    readingTime: "5분",
    publishedYear: 2019
  }
];

interface SummaryDetailPageProps {
  summaryId: string;
}

export default function SummaryDetailPage({ summaryId }: SummaryDetailPageProps) {
  const [summary, setSummary] = useState<BookSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 실제로는 API 요청을 통해 데이터를 가져옵니다
    const fetchData = () => {
      setIsLoading(true);
      try {
        const foundSummary = SUMMARIES.find(item => item.id === summaryId);
        if (foundSummary) {
          setSummary(foundSummary);
        } else {
          toast.error("요약본을 찾을 수 없습니다");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
        toast.error("요약본을 불러오는 중 오류가 발생했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [summaryId, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="container mx-auto py-10 flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">요약본을 찾을 수 없습니다</h1>
        <Button onClick={() => router.push("/dashboard")}>대시보드로 돌아가기</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"/></svg>
            돌아가기
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 책 정보 */}
          <div className="md:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="relative aspect-[3/4] w-full mb-4 rounded-md overflow-hidden">
                  <Image
                    src={summary.coverImage}
                    alt={summary.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h1 className="text-xl font-bold mb-1">{summary.title}</h1>
                <p className="text-muted-foreground mb-4">{summary.author}</p>
                
                <div className="text-sm space-y-2 border-t pt-4 mt-4">
                  <p><span className="font-medium">발행연도:</span> {summary.publishedYear}년</p>
                  <p><span className="font-medium">요약 일자:</span> {summary.date}</p>
                  <p><span className="font-medium">읽는 시간:</span> {summary.readingTime}</p>
                  <div className="flex flex-wrap mt-4 gap-2">
                    {summary.categories.map((category: string, index: number) => (
                      <span key={index} className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-full">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <Button className="w-full" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    PDF로 다운로드
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                    음성으로 듣기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 요약 내용 */}
          <div className="md:col-span-2">
            <article className="prose max-w-none prose-a:text-primary prose-headings:text-foreground">
              <div dangerouslySetInnerHTML={{ __html: summary.content }} />
            </article>

            <div className="border-t mt-10 pt-8">
              <h2 className="text-xl font-bold mb-4">이 책이 도움이 되었나요?</h2>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => toast.success("피드백을 보내주셔서 감사합니다!")}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                  도움이 되었어요
                </Button>
                <Button variant="outline" onClick={() => toast.success("피드백을 보내주셔서 감사합니다!")}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
                  개선이 필요해요
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 