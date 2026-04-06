import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Colors, Typography, Radius, Spacing } from '@/constants/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  prefix?: string;
  error?: string;
  helper?: string;
  containerStyle?: ViewStyle;
  testID?: string;
}

export function Input({
  label,
  prefix,
  error,
  helper,
  containerStyle,
  testID,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, focused && styles.focused, error && styles.errorBorder]}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          testID={testID}
          style={styles.input}
          placeholderTextColor={Colors.onSurfaceVariant}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {helper && !error && <Text style={styles.helper}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...Typography.label,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: Radius.default,
    paddingHorizontal: 20,
    minHeight: 52,
  },
  focused: {
    borderWidth: 2,
    borderColor: Colors.primary + '33',
  },
  errorBorder: {
    borderWidth: 2,
    borderColor: Colors.error + '33',
  },
  prefix: {
    ...Typography.input,
    color: Colors.onSurfaceVariant,
    marginRight: Spacing.xs,
  },
  input: {
    ...Typography.input,
    flex: 1,
    paddingVertical: Spacing.md,
  },
  error: {
    fontSize: 12,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  helper: {
    ...Typography.muted,
    fontSize: 12,
    marginTop: Spacing.xs,
  },
});
