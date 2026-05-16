import { DatePicker } from '@shared/ui/Picker';
import { StyleSheet, View } from 'react-native';

interface Props {
  date?: string;
  onDateChange?: (date: string) => void;
}

export function DiaryListAppBar({ date, onDateChange }: Props) {
  return (
    <View style={styles.container}>
      <DatePicker date={date} onDateChange={onDateChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    paddingHorizontal: 15,
  },
});
