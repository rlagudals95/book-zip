import { clientFetch } from '@/shared/api';

interface VerificationResponse {
  success: boolean;
  message: string;
}

interface SubscriptionResponse {
  id: string;
  email: string;
  interests: string[];
  isActive: boolean;
  createdAt: Date;
}

/**
 * 이메일 인증 요청
 */
export const requestVerification = async (email: string): Promise<VerificationResponse> => {
  return clientFetch.post<VerificationResponse>('email/request-verification', { email });
};

/**
 * 이메일 인증 코드 확인
 */
export const verifyEmail = async (email: string, code: string): Promise<VerificationResponse> => {
  return clientFetch.post<VerificationResponse>('email/verify', { email, code });
};

/**
 * 구독 신청
 */
export const subscribe = async (data: { email: string, interests: string[] }): Promise<SubscriptionResponse> => {
  return clientFetch.post<SubscriptionResponse>('subscribers', data);
};