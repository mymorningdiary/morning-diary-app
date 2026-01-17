export const PASSWORD_MAX_LEN = 64;

export const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[!@#$%^+=-])(?=.*[0-9]).{10,64}$/;

export const isPassword = (value: string) => PASSWORD_REGEX.test(value);

export const validatePassword = (value?: string) => {
  const isValid = isPassword(value ?? '');
  const message = isValid ? null : '비밀번호를 입력해주세요 (영문자+숫자+특수문자 10-64자)';

  return {
    isValid,
    message,
  };
};
