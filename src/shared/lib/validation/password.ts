export const PASSWORD_MAX_LEN = 64;

export const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[!@#$%^+=-])(?=.*[0-9])\S{10,64}$/;

export const isPassword = (value: string) => PASSWORD_REGEX.test(value);

export const validatePassword = ({
  value,
  successMessage,
  errorMessage,
}: {
  value?: string;
  successMessage?: string | null;
  errorMessage?: string;
}) => {
  const isValid = PASSWORD_REGEX.test(value ?? '');
  const message = isValid ? successMessage : errorMessage;
  // const message = isValid ? successMessage : '비밀번호를 입력해주세요 (영문자+숫자+특수문자 10-64자)';

  return {
    isValid,
    message: message ?? null,
  };
};

export const confirmPassword = (password1: string, password2: string) => {
  const isSame = password1 === password2;
  const message = isSame ? '비밀번호가 일치해요' : '비밀번호가 일치하지 않아요';

  return {
    isSame,
    message,
  };
};
