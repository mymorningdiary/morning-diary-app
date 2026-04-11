import { DatePicker } from '@shared/ui/Picker';
import { View } from 'react-native';

interface Props {
  date?: string;
  onDateChange?: (date: string) => void;
}

export function DiaryListHeader({ date, onDateChange }: Props) {
  return (
    <View style={{ padding: 16 }}>
      <DatePicker date={date} onDateChange={onDateChange} />
    </View>
  );
}
