import { IconKakao } from '@assets/icons';
import { MDButton } from '@shared/ui/Button';

import { useLoginKakao } from '../model/useLoginKakao';

interface Props {
  onSuccess?: (isExistUser: boolean) => void;
  onError?: (message: string) => void;
}

export function LoginKakaoButton({ onSuccess, onError }: Props) {
  const { kakaoLogin } = useLoginKakao({ onSuccess, onError });

  return (
    <MDButton variant="kakao" prefix={IconKakao} label={'카카오로 계속하기'} onPress={kakaoLogin} />
  );
}
