import { MDCol, MDPressable, MDRow, MDText } from '@/components';
import SettingAppBar from '@/domain/setting/SettingAppBar';
import SettingSection from '@/domain/setting/SettingSection';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

export default function Setting() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const navigateBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <View style={styles.container}>
      <SettingAppBar navigateBack={navigateBack} />

      <ScrollView contentContainerStyle={styles.containerContent} overScrollMode="never">
        <View>
          <SettingSection title="계정">
            <MDPressable style={styles.containerSectionItem}>
              <MDText type="bodyRegular">계정 관리</MDText>
              <MDPressable style={styles.buttonIconRight}>
                <Image
                  source={require('@/assets/images/ic-chevron_right.png')}
                  style={styles.icon}
                />
              </MDPressable>
            </MDPressable>
          </SettingSection>

          <View style={styles.divider} />

          <SettingSection title="시스템 설정">
            <MDRow style={styles.containerSectionItem}>
              <MDText type="bodyRegular">알림</MDText>
              <MDPressable style={styles.buttonIconRight}>
                <Image
                  source={require('@/assets/images/ic-chevron_right.png')}
                  style={styles.icon}
                />
              </MDPressable>
            </MDRow>

            <MDPressable style={styles.containerSectionItem}>
              <MDText style={styles.inactiveText} type="bodyRegular">
                알림 시간
              </MDText>
              <MDPressable style={styles.buttonIconRight}>
                <Image
                  source={require('@/assets/images/ic-chevron_right.png')}
                  style={styles.icon}
                  tintColor={colors.icon.alternative}
                />
              </MDPressable>
            </MDPressable>

            <MDPressable style={styles.containerSectionItem}>
              <MDText type="bodyRegular">아침일기 목표</MDText>
              <MDPressable style={styles.buttonIconRight}>
                <Image
                  source={require('@/assets/images/ic-chevron_right.png')}
                  style={styles.icon}
                />
              </MDPressable>
            </MDPressable>
          </SettingSection>

          <View style={styles.divider} />

          <SettingSection title="소통">
            <MDPressable style={styles.containerSectionItem}>
              <MDText type="bodyRegular">의견 보내기</MDText>
            </MDPressable>

            <MDPressable style={styles.containerSectionItem}>
              <MDText type="bodyRegular">리뷰 남기기</MDText>
            </MDPressable>
          </SettingSection>

          <View style={styles.divider} />

          <SettingSection title="정보">
            <MDPressable style={styles.containerSectionItem}>
              <MDText type="bodyRegular">이용 약관</MDText>
            </MDPressable>

            <MDPressable style={styles.containerSectionItem}>
              <MDText type="bodyRegular">개인정보처리방침</MDText>
            </MDPressable>

            <MDRow style={styles.containerSectionItem}>
              <MDText type="bodyRegular">버전 정보 1.0.0</MDText>
            </MDRow>
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

    containerSectionItem: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingStart: 16,
    },
    buttonIconRight: {
      height: '100%',
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: 24,
      height: 24,
    },
    divider: {
      height: 1,
      backgroundColor: colors.line.normal,
      marginHorizontal: 16,
    },
    inactiveText: {
      color: colors.text.alternative,
    },
  });
