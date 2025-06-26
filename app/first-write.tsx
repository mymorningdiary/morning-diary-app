import { MDButton, MDText } from '@/components';
import MDDotIndicator from '@/components/MDDotIndicator';
import AppBar from '@/domain/first-write/AppBar';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function FirstWrite() {
  const styles = ScreenStyles;

  const onCloseButtonPress = () => {
    router.replace('/main');
  };

  return (
    <View style={styles.container}>
      <AppBar onCloseButtonPress={onCloseButtonPress} />

      <View style={styles.containerDotIndicator}>
        <MDDotIndicator count={4} currentIndex={1} />
      </View>

      <View>
        <MDButton title="나만의 일기 스타일 고르기" onPress={() => {}} />
      </View>
    </View>
  );
}

const ScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  containerDotIndicator: {
    alignItems: 'center',
    marginTop: 40,
  },
});
