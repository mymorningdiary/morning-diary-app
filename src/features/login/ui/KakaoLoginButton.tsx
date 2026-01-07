import { IconKakao } from '@assets/icons';
import { MDButton } from '@shared/ui/MDButton';
import { useKakaoLogin } from '../model/useKakaoLogin';

interface Props {
  onSuccess: (isExistUser: boolean) => void;
  onError: (message: string) => void;
}

export function KakaoLoginButton({ onSuccess, onError }: Props) {
  const { kakaoLogin } = useKakaoLogin({ onSuccess, onError });

  return (
    <MDButton variant="kakao" prefix={IconKakao} label={'카카오로 계속하기'} onPress={kakaoLogin} />
  );
}
