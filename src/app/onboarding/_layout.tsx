import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';

function OnboardingHeader({ step }: { step: number }) {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>EduCal</Text>
      <Text style={styles.step}>STEP {step} OF 3</Text>
    </View>
  );
}

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="step1" />
      <Stack.Screen name="step2" />
      <Stack.Screen name="step3" />
    </Stack>
  );
}

export { OnboardingHeader };

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  logo: {
    ...Typography.heading,
    color: Colors.primary,
    fontWeight: '800',
  },
  step: {
    ...Typography.label,
    color: Colors.onSurfaceVariant,
  },
});
