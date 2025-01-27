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

  private static async request<T>(url: string, options: RequestOptions): Promise<T> {
    // console.log('[API Request]', {
    //   url,
    //   method: options.method,
    //   requiresAuth: options.requiresAuth,
    //   retry: options.retry,
    // });

    const { requiresAuth = false, retry = { count: 0, delay: 1000 }, ...fetchOptions } = options;

    try {
      const response = await this.fetchWithRetry(
        async () => {
          if (requiresAuth) {
            return this.authenticatedFetch(url, fetchOptions);
          }
          return fetch(url, fetchOptions);
        },
        retry.count,
        retry.delay,
      );

      if (!response.ok) {
        console.error('[API Error]', {
          url,
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      // console.log('[API Response]', {
      //   url,
      //   status: response.status,
      //   data,
      // });

      return data;
    } catch (error) {
      console.error('[API Request Failed]', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
        options,
      });
      throw error;
    }
  }

  private static async authenticatedFetch(url: string, options: RequestInit): Promise<Response> {
    if (await SessionManager.isSessionExpired()) {
      await ApiClient.refreshSessionToken();
    }

    const { accessToken } = await SessionManager.getSessionInfo();
    const headers = {
      ...options.headers,
      Authorization: accessToken ? `${accessToken}` : '',
      'Content-Type': 'application/json',
    };

    return fetch(url, { ...options, headers });
  }

  private static async fetchWithRetry(
    fn: () => Promise<Response>,
    retries: number,
    delay: number,
  ): Promise<Response> {
    try {
      const response = await fn();

      if (!response.ok && retries > 0 && [500, 503].includes(response.status)) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.fetchWithRetry(fn, retries - 1, delay * 2);
      }

      return response;
    } catch (error) {
      if (retries <= 0) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.fetchWithRetry(fn, retries - 1, delay * 2);
    }
  }

  static async refreshSessionToken(): Promise<SessionInfo> {
    const { refreshToken } = await SessionManager.getSessionInfo();
    const response = await ApiClient.post<SessionInfo>('/auth/refresh', {
      refreshToken,
    });
    await SessionManager.setSessionInfo(
      response.accessToken!,
      response.refreshToken!,
      response.expiredAt!,
    );
    return response;
  }

  static async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(`${API_CONFIG.baseUrl}${path}`, {
      method: 'GET',
      ...options,
    });
  }

  static async post<T>(path: string, body: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(`${API_CONFIG.baseUrl}${path}`, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    });
  }
}
