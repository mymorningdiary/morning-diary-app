import { forwardRef, useState } from 'react';
import type { ReactNode } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

type FieldStatus = 'default' | 'success' | 'error';

export interface MDFieldState {
  value?: string;
  status?: FieldStatus;
  message?: string | null;
}

interface Props extends TextInputProps {
  fieldStyle?: StyleProp<ViewStyle>;
  label?: string;
  status?: FieldStatus;
  message?: string | null;
  suffix?: ReactNode;
  tail?: ReactNode;
}

export const MDTextField = forwardRef<TextInput, Props>(
  (
    {
      fieldStyle,
      label,
      value,
      status = 'default',
      message,
      suffix,
      style: inputStyle,
      onFocus,
      onBlur,
      editable = true,
      accessibilityLabel,
      tail,
      ...rest
    },
    ref,
  ) => {
    const colors = useThemeColor();
    const styles = TextFieldStyles({ colors });

    const [isFocused, setIsFocused] = useState(false);

    const messageColor = status === 'error' ? colors.text.alternative : colors.primary.normal;

    const inputBorderColor =
      (value && value.length > 0) || isFocused ? colors.line.enabled : colors.line.normal;

    const handleFocus: TextInputProps['onFocus'] = (event) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur: TextInputProps['onBlur'] = (event) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    return (
      <View style={[styles.container, fieldStyle]}>
        {label && <MDText type="labelSemiBold">{label}</MDText>}
        <View style={styles.content}>
          <View style={[styles.inputBox, { borderBottomColor: inputBorderColor }]}>
            <TextInput
              ref={ref}
              style={[styles.input, inputStyle, !editable && styles.disabledInput]}
              placeholderTextColor={colors.text.alternative}
              allowFontScaling={false}
              autoCorrect={false}
              spellCheck={false}
              value={value}
              autoCapitalize="none"
              textContentType="oneTimeCode"
              autoComplete="off"
              cursorColor={colors.text.brand}
              selectionColor={colors.text.brand}
              editable={editable}
              accessibilityLabel={accessibilityLabel ?? label}
              {...rest}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {suffix}
          </View>
          {tail}
        </View>

        {message && (
          <MDText type="caption1Regular" color={messageColor}>
            {message}
          </MDText>
        )}
      </View>
    );
  },
);

const TextFieldStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      gap: 4,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    inputBox: {
      flex: 1,
      flexDirection: 'row',
      borderBottomWidth: 1,
      alignItems: 'center',
      gap: 12,
    },
    input: {
      flex: 1,
      height: 36,
      fontFamily: 'Pretendard',
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.normal,
      paddingVertical: 0,
      paddingHorizontal: 0,
      textAlignVertical: 'center',
    },
    disabledInput: {
      color: colors.text.alternative,
    },
  });

MDTextField.displayName = 'MDTextField';
export default MDTextField;
