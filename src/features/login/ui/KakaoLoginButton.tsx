import { IconKakao } from '@assets/icons';
import { MDButton } from '@shared/ui/MDButton';
import { useKakaoLogin } from '../model/useKakaoLogin';

export function KakaoLoginButton() {
  const { loginWithKakao } = useKakaoLogin();

  return (
    <MDButton
      variant="kakao"
      prefix={IconKakao}
      label={'카카오로 계속하기'}
      onPress={loginWithKakao}
    />
  );
}
