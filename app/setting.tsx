import { MDText } from '@/components';
import SettingAppBar from '@/domain/setting/SettingAppBar';
import SettingSection from '@/domain/setting/SettingSection';
import SettingSectionListItem from '@/domain/setting/SettingSectionListItem';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Setting() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const [isAlarmOn, setIsAlarmOn] = useState(false);

  const navigateBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <View style={styles.container}>
      <SettingAppBar navigateBack={navigateBack} />

      <ScrollView contentContainerStyle={styles.containerContent} overScrollMode="never">
        <View>
          <SettingSection title="계정">
            <SettingSectionListItem
              label="계정 관리"
              tailComponent={
                <Image
                  style={styles.icon}
                  source={require('@/assets/images/ic-chevron_right.png')}
                />
              }
            />
          </SettingSection>

          <View style={styles.divider} />

          <SettingSection title="시스템 설정">
            <SettingSectionListItem label="알림" />
            <SettingSectionListItem
              label="알림 시간"
              disabled={!isAlarmOn}
              tailComponent={
                <Image
                  style={styles.icon}
                  source={require('@/assets/images/ic-chevron_right.png')}
                  tintColor={isAlarmOn ? colors.icon.normal : colors.icon.alternative}
                />
              }
            />
            <SettingSectionListItem
              label="아침일기 목표"
              tailComponent={
                <Image
                  style={styles.icon}
                  source={require('@/assets/images/ic-chevron_right.png')}
                />
              }
            />
          </SettingSection>

          <View style={styles.divider} />

          <SettingSection title="소통">
            <SettingSectionListItem label="의견 보내기" />
            <SettingSectionListItem label="리뷰 남기기" />
          </SettingSection>

          <View style={styles.divider} />

          <SettingSection title="정보">
            <SettingSectionListItem label="이용약관" />
            <SettingSectionListItem label="개인정보처리방침" />
            <SettingSectionListItem
              label="버전 정보 1.0.0"
              tailComponent={
                <MDText type="bodyRegular" color={colors.text.alternative}>
                  최신 버전
                </MDText>
              }
            />
          </SettingSection>
        </View>
      </ScrollView>
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
