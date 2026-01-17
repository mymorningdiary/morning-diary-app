import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonType,
  AppleAuthenticationButtonStyle,
} from 'expo-apple-authentication';

import { getButtonSizeConfig } from '@shared/ui/Button';

import { useLoginApple } from '../model/useLoginApple';

interface Props {
  onSuccess: (isExistUser: boolean) => void;
  onError: (message: string) => void;
}

export function LoginAppleButton({ onSuccess, onError }: Props) {
  const { appleLogin } = useLoginApple({ onSuccess, onError });

  return (
    <AppleAuthenticationButton
      buttonType={AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={14}
      style={getButtonSizeConfig('medium').container}
      onPress={appleLogin}
    />
  );
}
