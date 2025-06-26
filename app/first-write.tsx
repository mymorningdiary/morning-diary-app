import { MDText } from '@/components';
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
      <MDText>첫 일기 작성</MDText>
    </View>
  );
}

const ScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});
