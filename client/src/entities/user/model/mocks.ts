import { User } from './types';

export const MOCK_USER: User = {
  id: '1',
  name: "홍길동",
  email: "user@example.com",
  subscription: {
    type: "premium",
    status: "active",
    nextBillingDate: "2024-05-01",
  },
  interests: ["개발/프로그래밍", "경영/비즈니스", "자기계발"]
}; 