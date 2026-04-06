import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors, Typography, Radius, Spacing } from '@/constants/theme';

interface ProgressBarProps {
  progress: number; // 0–1
  label?: string;
  showPercent?: boolean;
  testID?: string;
}

export function ProgressBar({
  progress,
  label,
  showPercent = true,
  testID,
}: ProgressBarProps) {
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: Math.min(Math.max(progress, 0), 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View testID={testID}>
      {(label || showPercent) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercent && (
            <Text style={styles.percent}>{Math.round(progress * 100)}%</Text>
          )}
        </View>
      )}
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: width.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.label,
  },
  percent: {
    ...Typography.label,
  },
  track: {
    height: 8,
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
});
