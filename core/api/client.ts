import { SessionManager, SessionInfo } from '../storage/session';
import { API_CONFIG } from './config';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  retry?: {
    count: number;
    delay: number;
  };
}

export class ApiClient {
  private constructor() {} // NOTE: new SessionManager()와 같은 방식으로 클래스의 인스턴스를 생성하는 것을 막음. Static Utility Class 패턴

  private static async request<T>(
    url: string,
    options: RequestOptions,
    requiresAuth: boolean = false,
  ): Promise<T> {
    try {
      const { method, headers, body } = options;
      const { accessToken } = await SessionManager.getSessionInfo();

      console.log('[API Request]', {
        url,
        options,
        requiresAuth,
        accessToken,
      });

      const response = await fetch(url, {
        headers: {
          ...headers,
          ...(requiresAuth && accessToken && { Authorization: `Bearer ${accessToken}` }),
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
    return this.request<T>(`${API_CONFIG.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
  }

  static async post<T>(path: string, body: any, requiresAuth?: boolean): Promise<T> {
    return this.request<T>(
      `${API_CONFIG.baseUrl}${path}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
      requiresAuth,
    );
  }
}
