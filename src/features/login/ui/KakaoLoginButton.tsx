import { IconKakao } from '@assets/icons';
import { MDButton } from '@shared/ui/MDButton';
import { useKakaoLogin } from '../model/useKakaoLogin';

interface Props {
  onLogin: (isExistUser: boolean) => void;
}

export function KakaoLoginButton({ onLogin }: Props) {
  const { loginWithKakao } = useKakaoLogin({ onLogin });

  return (
    <MDButton
      variant="kakao"
      prefix={IconKakao}
      label={'카카오로 계속하기'}
      onPress={loginWithKakao}
    />
  );
}
