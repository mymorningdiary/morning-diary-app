import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonType,
  AppleAuthenticationButtonStyle,
} from 'expo-apple-authentication';

import { useAppleLogin } from '../model/useAppleLogin';
import { getButtonSizeConfig } from '@shared/ui/Button';

interface Props {
  onSuccess: (isExistUser: boolean) => void;
  onError: (message: string) => void;
}

export function AppleLoginButton({ onSuccess, onError }: Props) {
  const { appleLogin } = useAppleLogin({ onSuccess, onError });

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
