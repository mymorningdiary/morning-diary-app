import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { forwardRef, useState } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { MDText } from './MDText';

interface Props extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  label?: string;
  error?: string;
  helperText?: string | null;
  isValid?: boolean;
  suffix?: React.ReactNode;
}

const MDTextField = forwardRef<TextInput, Props>(
  ({ containerStyle, label, helperText, isValid, suffix, ...props }, ref) => {
    const colors = useThemeColor();
    const styles = TextFieldStyles({ colors });

    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <MDText type="labelSemiBold">{label}</MDText>}
        <View style={[styles.row, isFocused && { borderBottomColor: colors.line.enabled }]}>
          <TextInput
            ref={ref}
            style={styles.textInput}
            placeholderTextColor={colors.text.alternative}
            allowFontScaling={false}
            autoCorrect={false}
            spellCheck={false}
            autoCapitalize="none"
            cursorColor={colors.text.brand}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {suffix}
        </View>

        {isValid && helperText && (
          <MDText type="caption1Regular" color={colors.text.alternative}>
            {helperText}
          </MDText>
        )}

        {!isValid && helperText && (
          <MDText type="caption1Regular" color={colors.text.alternative}>
            {helperText}
          </MDText>
        )}
      </View>
    );
  },
);

const TextFieldStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      gap: 4,
    },
    row: {
      width: '100%',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.line.normal,
      alignItems: 'center',
      gap: 12,
    },
    textInput: {
      flex: 1,
      height: 36,
      fontFamily: 'Pretendard',
      fontSize: 14,
      fontWeight: 400,
      color: colors.text.normal,
      paddingVertical: 0,
      paddingHorizontal: 0,
      textAlignVertical: 'center',
    },
    textInputWithTail: {
      paddingRight: 8,
    },
  });

MDTextField.displayName = 'MDTextField';
export default MDTextField;
