'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon } from "lucide-react";


// 구독 플랜 정보
const SUBSCRIPTION_PLANS = [
  {
    id: "basic",
    name: "베이직",
    price: "월 9,900원",
    features: [
      "매일 1권의 책 요약본",
      "모바일/데스크톱 접근 가능",
      "이메일로 요약본 배송",
      "기본 관심사 설정"
    ],
    isPopular: false,
  },
  {
    id: "premium",
    name: "프리미엄",
    price: "월 14,900원",
    features: [
      "매일 2권의 책 요약본",
      "모바일/데스크톱 접근 가능",
      "이메일로 요약본 배송",
      "무제한 관심사 설정",
      "오디오 요약본 지원",
      "핵심 문장 하이라이팅"
    ],
    isPopular: true,
  },
  {
    id: "business",
    name: "비즈니스",
    price: "월 29,900원",
    features: [
      "매일 3권의 책 요약본",
      "모바일/데스크톱 접근 가능",
      "이메일로 요약본 배송",
      "무제한 관심사 설정",
      "오디오 요약본 지원",
      "핵심 문장 하이라이팅",
      "팀원 5명까지 공유 가능",
      "팀 대시보드 제공"
    ],
    isPopular: false,
  }
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubmit = async () => {
    if (!selectedPlan) {
      toast.error("구독 플랜을 선택해주세요.");
      return;
    }

    setIsLoading(true);
    try {

      // 임시로 성공 처리
      setTimeout(() => {
        toast.success("구독이 완료되었습니다!");
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error("구독 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">구독 플랜 선택</h1>
        <p className="text-muted-foreground">
          나에게 맞는 독서 구독 플랜을 선택해보세요. 모든 플랜은 14일 무료 체험이 가능합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden ${
              selectedPlan === plan.id
                ? "border-primary ring-2 ring-primary ring-opacity-50"
                : ""
            } ${plan.isPopular ? "shadow-lg" : "shadow-sm"}`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium">
                인기 플랜
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground"> / 14일 무료 체험</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={selectedPlan === plan.id ? "default" : "outline"}
                className="w-full"
                onClick={() => handleSelectPlan(plan.id)}
              >
                {selectedPlan === plan.id ? "선택됨" : "선택하기"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!selectedPlan || isLoading}
        >
          {isLoading ? "처리 중..." : "구독 시작하기"}
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          첫 14일은 무료로 체험하실 수 있으며, 만족하지 않으시면 언제든지 취소 가능합니다.
        </p>
      </div>
    </div>
  );
} 