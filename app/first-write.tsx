import { MDText } from '@/components';
import { StyleSheet, View } from 'react-native';

export default function FirstWrite() {
  const styles = ScreenStyles;

  return (
    <View style={styles.container}>
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
