import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Card({
  children,
  variant = 'elevated',
  style,
  testID,
}: CardProps) {
  return (
    <View
      testID={testID}
      style={[
        styles.base,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        variant === 'filled' && styles.filled,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.default,
    padding: Spacing.lg,
  },
  elevated: {
    backgroundColor: Colors.surfaceWhite,
    ...Shadows.sm,
  },
  outlined: {
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 1,
    borderColor: Colors.outlineLight,
  },
  filled: {
    backgroundColor: Colors.primaryContainer,
  },
});
