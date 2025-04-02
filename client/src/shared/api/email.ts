// 기존 api.ts 파일에 추가
export const requestVerification = async (email: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email/request-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '인증 요청 실패');
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  };
  
  export const verifyEmail = async (email: string, code: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscribers/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '인증 실패');
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  };
  
  export const subscribe = async (data: { email: string, interests: string[] }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '구독 신청 실패');
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  };