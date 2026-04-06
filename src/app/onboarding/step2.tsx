import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Colors, Typography, Spacing, Radius, Layout, Shadows } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { OnboardingHeader } from './_layout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { validateIncome } from '@/utils/validation';

export default function Step2Screen() {
  const {
    monthlyIncome,
    setMonthlyIncome,
    currentSavings,
    setCurrentSavings,
    location,
    setLocation,
    setCurrentStep,
  } = useOnboardingStore();

  const [incomeText, setIncomeText] = useState(
    monthlyIncome > 0 ? monthlyIncome.toString() : '',
  );
  const [savingsText, setSavingsText] = useState(
    currentSavings > 0 ? currentSavings.toString() : '',
  );
  const [incomeError, setIncomeError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  const handleIncomeChange = (text: string) => {
    const clean = text.replace(/[^0-9.]/g, '');
    setIncomeText(clean);
    const num = parseFloat(clean);
    if (!isNaN(num)) {
      setMonthlyIncome(num);
      setIncomeError(null);
    }
  };

  const handleSavingsChange = (text: string) => {
    const clean = text.replace(/[^0-9.]/g, '');
    setSavingsText(clean);
    const num = parseFloat(clean);
    if (!isNaN(num)) setCurrentSavings(num);
  };

  const handleUseLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationDenied(true);
        setLocationLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const name = geocode
        ? [geocode.city, geocode.region].filter(Boolean).join(', ')
        : `${loc.coords.latitude.toFixed(2)}, ${loc.coords.longitude.toFixed(2)}`;

      setLocation({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        name,
      });
      setLocationDenied(false);
    } catch (error) {
      Alert.alert('Location Error', 'Unable to get your location. You can proceed without it.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    router.back();
  };

  const handleNext = () => {
    const error = validateIncome(parseFloat(incomeText) || 0);
    if (error) {
      setIncomeError(error);
      return;
    }
    setCurrentStep(3);
    router.push('/onboarding/step3');
  };

  return (
    <SafeAreaView style={styles.safe} testID="step2-screen">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <OnboardingHeader step={2} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress */}
          <ProgressBar
            testID="step2-progress-bar"
            progress={0.5}
            label="SETUP PROGRESS"
          />

          {/* Heading */}
          <Text style={styles.title}>Your Financial Snapshot</Text>
          <Text style={styles.subtitle}>
            Help us personalize your education plan by providing a few financial
            details and your location for local cost accuracy.
          </Text>

          {/* Income */}
          <Input
            testID="income-input"
            label="MONTHLY HOUSEHOLD INCOME"
            prefix="$"
            placeholder="0.00"
            value={incomeText}
            onChangeText={handleIncomeChange}
            error={incomeError ?? undefined}
            helper="Combined after-tax income from all sources."
            keyboardType="decimal-pad"
          />

          {/* Savings */}
          <Input
            testID="savings-input"
            label="CURRENT EDUCATION SAVINGS"
            prefix="$"
            placeholder="0.00"
            value={savingsText}
            onChangeText={handleSavingsChange}
            keyboardType="decimal-pad"
            containerStyle={{ marginTop: Spacing.lg }}
          />

          {/* Location Card */}
          <Card variant="outlined" style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <MaterialIcons
                name="location-on"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.locationTitle}>Local School Costs</Text>
            </View>
            <Text style={styles.locationSubtext}>
              Find average tuition in your current area.
            </Text>

            {location ? (
              <View testID="location-status" style={styles.locationSuccess}>
                <MaterialIcons
                  name="check-circle"
                  size={20}
                  color={Colors.success}
                />
                <Text style={styles.locationName}>{location.name}</Text>
              </View>
            ) : (
              <>
                <Button
                  testID="use-location-button"
                  title="Use Current Location"
                  onPress={handleUseLocation}
                  icon="my-location"
                  loading={locationLoading}
                  style={{ marginTop: Spacing.md }}
                />
                {locationDenied && (
                  <Text testID="location-status" style={styles.locationDenied}>
                    Location helps us find local schools. You can enter manually
                    in the next step.
                  </Text>
                )}
              </>
            )}

            {location && (
              <View testID="location-map" style={styles.mapPlaceholder}>
                <MaterialIcons name="map" size={40} color={Colors.onSurfaceVariant} />
                <Text style={styles.mapText}>
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </Text>
              </View>
            )}
          </Card>
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <Button
            testID="step2-back-button"
            title="BACK"
            variant="text"
            onPress={handleBack}
            icon="arrow-back"
          />
          <Button
            testID="step2-next-button"
            title="NEXT"
            onPress={handleNext}
            icon="arrow-forward"
            iconPosition="right"
            style={{ flex: 1, marginLeft: Spacing.md }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingBottom: 100,
  },
  title: {
    ...Typography.heading,
    fontSize: 24,
    marginTop: Spacing.lg,
  },
  subtitle: {
    ...Typography.muted,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  locationCard: {
    marginTop: Spacing.lg,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  locationTitle: {
    ...Typography.cardHeading,
  },
  locationSubtext: {
    ...Typography.muted,
    marginBottom: Spacing.sm,
  },
  locationSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: '#F0FDF4',
    borderRadius: Radius.default,
  },
  locationName: {
    ...Typography.body,
    color: Colors.success,
    fontWeight: '600',
  },
  locationDenied: {
    ...Typography.muted,
    fontSize: 12,
    color: Colors.warning,
    marginTop: Spacing.sm,
  },
  mapPlaceholder: {
    marginTop: Spacing.md,
    height: 100,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: Radius.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    ...Typography.muted,
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineLight,
    backgroundColor: Colors.surfaceWhite,
  },
});
