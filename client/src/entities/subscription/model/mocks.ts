import { SubscriptionPlan } from './types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
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