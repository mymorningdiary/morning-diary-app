import { SessionManager } from '../storage/session';
import { API_CONFIG } from './config';

type RequestOptions = {
  requireAuth?: boolean;
};

export class ApiClient {
  private constructor() {} // NOTE: new SessionManager()와 같은 방식으로 클래스의 인스턴스를 생성하는 것을 막음. Static Utility Class 패턴

  private static async request<T>(
    url: string,
    init: RequestInit,
    options?: RequestOptions,
  ): Promise<T> {
    try {
      const { method, headers, body } = init;
      const { requireAuth } = options ?? { requireAuth: false };
      const { accessToken } = await SessionManager.getSessionInfo();

      console.log('[API Request]', {
        url,
        options,
        requireAuth,
        accessToken,
      });

      const response = await fetch(url, {
        headers: {
          ...headers,
          ...(requireAuth && accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        method,
        body,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[API Error]', {
          url,
          status: response.status,
          error,
        });
        throw error;
      }

      const res = await response.json();
      console.log('[API Response]', {
        url,
        status: response.status,
        res,
      });

      return res;
    } catch (error) {
      console.error('[API Request Failed]', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
        options,
      });
      throw error;
    }
  }

  static async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(
      `${API_CONFIG.baseUrl}${path}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      options,
    );
  }

  static async post<T>(path: string, body: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(
      `${API_CONFIG.baseUrl}${path}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
      options,
    );
  }
}
