import { DatePicker } from '@shared/ui/Picker';
import { View } from 'react-native';

interface Props {
  date?: string;
  onDateChange?: (date: string) => void;
}

export function DiaryListHeader({ date, onDateChange }: Props) {
  return (
    <View style={{ paddingBottom: 16 }}>
      <DatePicker date={date} onDateChange={onDateChange} />
    </View>
  );
}
