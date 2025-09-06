import { MDText } from '@/components';
import { withAuthGuard } from '@/components/AuthGuard';
import { useAuth } from '@/contexts/AuthContext3';
import { useUser } from '@/contexts/UserContext';
import LogoutModal from '@/domain/setting/LogoutModal';
import SettingAppBar from '@/domain/setting/SettingAppBar';
import SettingSection from '@/domain/setting/SettingSection';
import SettingSectionListItem from '@/domain/setting/SettingSectionListItem';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

function AccountScreen() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const [isOpenLogoutModal, setIsOpenLogoutModal] = useState(false);

  const { logout } = useAuth();
  const { user } = useUser();

  const navigateBack = useCallback(() => {
    router.back();
  }, []);

  const navigateToWithdraw = useCallback(() => {
    // TODO router.push('/withdraw');
  }, []);

  const openLogoutModal = useCallback(() => {
    setIsOpenLogoutModal(true);
  }, []);

  const closeLogoutModal = useCallback(() => {
    setIsOpenLogoutModal(false);
  }, []);

  const handleLogout = () => {
    closeLogoutModal();
    logout();
  };

  return (
    <View style={styles.container}>
      <SettingAppBar title="계정관리" navigateBack={navigateBack} />

      <ScrollView contentContainerStyle={styles.containerContent} overScrollMode="never">
        <View>
          <SettingSection title="계정">
            <SettingSectionListItem
              label={user?.email ?? ''}
              tailComponent={
                <MDText type="bodyRegular" color={colors.text.alternative}>
                  카카오 연동
                </MDText>
              }
            />
          </SettingSection>

          <View style={styles.divider} />

          <SettingSection title="관리">
            <SettingSectionListItem label="로그아웃" onPress={openLogoutModal} />
            <SettingSectionListItem
              label="회원 탈퇴"
              tailComponent={
                <Image
                  style={styles.icon}
                  source={require('@/assets/images/ic-chevron_right.png')}
                  tintColor={colors.icon.normal}
                />
              }
              onPress={navigateToWithdraw}
            />
          </SettingSection>
        </View>
      </ScrollView>

      <LogoutModal
        title="일기를 삭제할까요?"
        opened={isOpenLogoutModal}
        closeModal={closeLogoutModal}
        logout={handleLogout}
      />
    </View>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    containerContent: {
      paddingBottom: 40,
    },
    divider: {
      height: 1,
      backgroundColor: colors.line.normal,
      marginHorizontal: 16,
    },
    icon: {
      width: 24,
      height: 24,
    },
  });

export default withAuthGuard(AccountScreen);
