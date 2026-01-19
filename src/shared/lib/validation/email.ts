export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateEmail = (value?: string) => {
  const isValid = EMAIL_REGEX.test(value ?? '');
  const message = isValid ? '사용 가능한 이메일이에요' : '이메일을 올바르게 입력해주세요';

  return {
    isValid,
    message,
  };
};
