export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateEmail = ({
  value,
  successMessage,
  errorMessage,
}: {
  value?: string;
  successMessage?: string | null;
  errorMessage?: string;
}) => {
  const isValid = EMAIL_REGEX.test(value ?? '');
  const message = isValid ? successMessage : errorMessage;

  return {
    isValid,
    message: message ?? null,
  };
};
