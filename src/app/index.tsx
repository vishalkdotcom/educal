import { Redirect } from 'expo-router';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export default function IndexScreen() {
  const onboardingComplete = useOnboardingStore((s) => s.onboardingComplete);

  if (onboardingComplete) {
    return <Redirect href="/(tabs)/horizon" />;
  }

  return <Redirect href="/onboarding/step1" />;
}
