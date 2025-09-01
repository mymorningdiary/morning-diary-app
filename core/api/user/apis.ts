import { User } from '@/core/types';
import apiClient from '../axios';
import { ApiResponse } from '../types';
import { UpdateAlarmTimeRequest, UpdatePushTokenRequest, UpdateTextGoalRequest } from './types';

const userAPI = {
  getUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/users/info');
    return response.data;
  },
  updateTextGoal: async (body: UpdateTextGoalRequest): Promise<ApiResponse<null>> => {
    const response = await apiClient.put('/users/text-goal', body);
    return response.data;
  },
  updatePushToken: async (body: UpdatePushTokenRequest): Promise<ApiResponse<null>> => {
    const response = await apiClient.put('/users/push-token', body);
    return response.data;
  },
  updateAlarmTime: async (body: UpdateAlarmTimeRequest): Promise<ApiResponse<null>> => {
    const response = await apiClient.put('/users/alarm-time', body);
    return response.data;
  },
};

export default userAPI;
