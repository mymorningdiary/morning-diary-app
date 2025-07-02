import { MDPressable, MDText } from '@/components';
import { useThemeColor } from '@/hooks';
import { StyleSheet } from 'react-native';

interface Props {
  label: string;
  disabled?: boolean;
  tailComponent?: React.ReactNode;
  onPress?: () => void;
}

export default function SettingSectionListItem({
  label,
  disabled = false,
  tailComponent,
  onPress,
}: Props) {
  const colors = useThemeColor();
  const styles = ItemStyles;

  return (
    <MDPressable style={styles.container} onPress={onPress} disabled={disabled}>
      <MDText type="bodyRegular" color={disabled ? colors.text.alternative : colors.text.normal}>
        {label}
      </MDText>
      {tailComponent}
    </MDPressable>
  );
}

const ItemStyles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});

//   <MDPressable style={styles.buttonIconRight}>
//     <Image source={require('@/assets/images/ic-chevron_right.png')} style={styles.icon} />
//   </MDPressable>;
