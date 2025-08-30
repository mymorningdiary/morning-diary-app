export type UpdateTextGoalRequest = {
  textGoalId: number;
};

export interface UpdatePushTokenRequest {
  pushToken: string | null;
}

export interface UpdateAlarmTimeRequest {
  alarmTime: string;
}
