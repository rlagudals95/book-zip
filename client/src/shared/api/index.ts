import ky, { Options, BeforeRequestHook, AfterResponseHook } from 'ky';
import { cache } from 'react';

// 기본 URL 설정 (환경 변수 사용)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777';

// 타입 선언
type ApiOptions = Omit<Options, 'hooks'> & {
  hooks?: {
    beforeRequest?: BeforeRequestHook[];
    afterResponse?: AfterResponseHook[];
  }
};

// 타입 선언 추가
interface RetryOptions {
  limit: number;
  methods: string[];
  statusCodes: number[];
}

// 공통 옵션 설정
const commonOptions: ApiOptions = {
  timeout: 30000, // 30초 타임아웃
  retry: {
    limit: 2, // 최대 2번 재시도
    methods: ['get'], // GET 요청만 재시도
    statusCodes: [408, 413, 429, 500, 502, 503, 504], // 재시도할 상태 코드
  } as RetryOptions,
  hooks: {
    beforeRequest: [
      (request: Request) => {
        // 요청 전 훅 (인증 토큰 추가 등)
        request.headers.set('Accept', 'application/json');
        // 여기에 필요한 인증 헤더 추가 가능
      }
    ],
    afterResponse: [
      (_request: Request, _options: Options, response: Response) => {
        // 응답 후 훅 (로깅, 에러 핸들링 등)
        if (!response.ok) {
          console.error(`API 에러: ${response.status} ${response.statusText}`);
        }
        return response;
      }
    ]
  }
};

// 클라이언트 인스턴스 (브라우저에서 실행)
export const clientApi = ky.create({
  prefixUrl: API_URL,
  credentials: 'include', // 쿠키 포함
  ...commonOptions,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// 서버 인스턴스 (서버 사이드 렌더링에서 실행)
// Next.js 서버 컴포넌트에서 사용
export const serverApi = ky.create({
  prefixUrl: process.env.API_SERVER_URL || API_URL, // 서버 환경 변수 사용 가능
  ...commonOptions,
  // 서버 특정 옵션
  retry: {
    limit: 3,
    methods: (commonOptions.retry as RetryOptions).methods,
    statusCodes: (commonOptions.retry as RetryOptions).statusCodes,
  } as RetryOptions,
  hooks: {
    ...commonOptions.hooks,
    beforeRequest: [
      (request: Request) => {
        // 서버 전용 헤더 추가
        request.headers.set('Accept', 'application/json');
        request.headers.set('User-Agent', 'NextJS/Server');
        // 추가 서버 헤더 설정 가능
      }
    ]
  }
});

// API 요청 옵션 타입
interface FetchOptions extends Partial<Options> {
  [key: string]: unknown;
}

// 서버 컴포넌트에서 사용할 캐시된 fetch 함수들
export const fetchApi = {
  // GET 요청을 위한 캐시된 함수
  get: cache(async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    try {
      return await serverApi.get(endpoint, options).json<T>();
    } catch (error) {
      console.error(`API 호출 오류 (GET ${endpoint}):`, error);
      throw error;
    }
  }),

  // POST 요청
  post: cache(async <T>(endpoint: string, json: Record<string, unknown>, options: FetchOptions = {}): Promise<T> => {
    try {
      return await serverApi.post(endpoint, { 
        json,
        ...options 
      }).json<T>();
    } catch (error) {
      console.error(`API 호출 오류 (POST ${endpoint}):`, error);
      throw error;
    }
  }),

  // PUT 요청
  put: cache(async <T>(endpoint: string, json: Record<string, unknown>, options: FetchOptions = {}): Promise<T> => {
    try {
      return await serverApi.put(endpoint, { 
        json,
        ...options 
      }).json<T>();
    } catch (error) {
      console.error(`API 호출 오류 (PUT ${endpoint}):`, error);
      throw error;
    }
  }),

  // DELETE 요청
  delete: cache(async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    try {
      return await serverApi.delete(endpoint, options).json<T>();
    } catch (error) {
      console.error(`API 호출 오류 (DELETE ${endpoint}):`, error);
      throw error;
    }
  }),
};

// 클라이언트 컴포넌트에서 사용할 래퍼 함수들
export const clientFetch = {
  // GET 요청
  get: async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    try {
      return await clientApi.get(endpoint, options).json<T>();
    } catch (error) {
      console.error(`클라이언트 API 호출 오류 (GET ${endpoint}):`, error);
      throw error;
    }
  },

  // POST 요청
  post: async <T>(endpoint: string, json: Record<string, unknown>, options: FetchOptions = {}): Promise<T> => {
    try {
      return await clientApi.post(endpoint, { 
        json,
        ...options 
      }).json<T>();
    } catch (error) {
      console.error(`클라이언트 API 호출 오류 (POST ${endpoint}):`, error);
      throw error;
    }
  },

  // PUT 요청
  put: async <T>(endpoint: string, json: Record<string, unknown>, options: FetchOptions = {}): Promise<T> => {
    try {
      return await clientApi.put(endpoint, { 
        json,
        ...options 
      }).json<T>();
    } catch (error) {
      console.error(`클라이언트 API 호출 오류 (PUT ${endpoint}):`, error);
      throw error;
    }
  },

  // DELETE 요청
  delete: async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    try {
      return await clientApi.delete(endpoint, options).json<T>();
    } catch (error) {
      console.error(`클라이언트 API 호출 오류 (DELETE ${endpoint}):`, error);
      throw error;
    }
  },
};

// 클라이언트/서버 환경 감지 유틸리티
export const isServer = typeof window === 'undefined';
export const isClient = !isServer;

// 환경에 따라 적절한 API 인스턴스 반환
export const api = isServer ? serverApi : clientApi;