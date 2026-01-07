import { apiClient } from '@shared/api/client';
import { ApiResponse, Auth } from '@shared/api/types';

interface PostAuthKakaoLoginRequest {
  accessToken: string;
}

export const postKakaoLogin = async (
  body: PostAuthKakaoLoginRequest,
): Promise<ApiResponse<Auth>> => {
  const response = await apiClient.post('/auth/kakao/login', body);
  return response.data;
};
