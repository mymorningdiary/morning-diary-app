import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { MDText } from './MDText';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

const MDTextField = forwardRef<TextInput, Props>(({ label, error, ...props }, ref) => {
  const colors = useThemeColor();
  const styles = TextFieldStyles({ colors });

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <MDText type="labelSemiBold">{label}</MDText>}
      <View style={[styles.textInputBox, isFocused && { borderBottomColor: colors.line.enabled }]}>
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
      </View>

      {error && (
        <MDText type="caption1Regular" color={colors.text.alternative}>
          {error}
        </MDText>
      )}
    </View>
  );
});

const TextFieldStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      gap: 4,
    },
    textInputBox: {
      width: '100%',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.line.normal,
      alignItems: 'center',
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
  });

MDTextField.displayName = 'MDTextField';
export default MDTextField;
