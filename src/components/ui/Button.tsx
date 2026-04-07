import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Colors,
  Typography,
  Radius,
  Shadows,
  Spacing,
} from '@/constants/theme';

type Variant = 'primary' | 'outlined' | 'text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  style,
  textStyle,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outlined' && styles.outlined,
        variant === 'text' && styles.text,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size='small'
          color={variant === 'primary' ? '#FFFFFF' : Colors.primary}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <MaterialIcons
              name={icon}
              size={18}
              color={variant === 'primary' ? '#FFFFFF' : Colors.primary}
              style={{ marginRight: Spacing.sm }}
            />
          )}
          <Text
            style={[
              styles.label,
              variant === 'primary' && styles.primaryLabel,
              variant === 'outlined' && styles.outlinedLabel,
              variant === 'text' && styles.textLabel,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <MaterialIcons
              name={icon}
              size={18}
              color={variant === 'primary' ? '#FFFFFF' : Colors.primary}
              style={{ marginLeft: Spacing.sm }}
            />
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.default,
    minHeight: 48,
  },
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.sm,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...Typography.button,
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  outlinedLabel: {
    color: Colors.primary,
  },
  textLabel: {
    color: Colors.primary,
  },
});
