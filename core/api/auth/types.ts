export interface PostAuthKakaoLoginInRequest {
  accessToken: string;
}

export interface PostAuthSignUpRequest {
  email: string;
  password: string;
}

export interface PostAuthVerifyEmailRequest {
  email: string;
  authenticationNumber: string;
}

export interface PostAuthDuplicateEmailRequest {
  email: string;
}
