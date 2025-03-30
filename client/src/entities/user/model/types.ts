export interface User {
  id: string;
  name: string;
  email: string;
  subscription?: Subscription;
  interests: string[];
}

export interface Subscription {
  type: 'basic' | 'premium' | 'business';
  status: 'active' | 'canceled' | 'paused';
  nextBillingDate: string;
  startDate?: string;
  endDate?: string;
  lastBillingDate?: string;
} 