import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
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
import { COUNTRY_CONFIGS } from '@/constants/countries';
import type { CountryCode } from '@/types';

export default function Step2Screen() {
  const {
    countryCode,
    setCountryCode,
    monthlyIncome,
    setMonthlyIncome,
    currentSavings,
    setCurrentSavings,
    location,
    setLocation,
    setCurrentStep,
  } = useOnboardingStore();

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const countryConfig = COUNTRY_CONFIGS[countryCode];
  const currencySymbol = countryConfig.currency.symbol;

  const [incomeText, setIncomeText] = useState(
    monthlyIncome > 0 ? monthlyIncome.toString() : '',
  );
  const [savingsText, setSavingsText] = useState(
    currentSavings > 0 ? currentSavings.toString() : '',
  );
  const [incomeError, setIncomeError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [citySearching, setCitySearching] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);

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

  const handleCitySearch = async () => {
    const query = cityInput.trim();
    if (!query) return;
    setCitySearching(true);
    setCityError(null);
    try {
      const results = await Location.geocodeAsync(query);
      if (results.length === 0) {
        setCityError('Could not find that location. Try a different city name.');
        return;
      }
      const { latitude, longitude } = results[0];
      const [geocode] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const name = geocode
        ? [geocode.city, geocode.region].filter(Boolean).join(', ')
        : query;
      setLocation({ lat: latitude, lng: longitude, name });
      setLocationDenied(false);
    } catch {
      setCityError('Search failed. Check your connection and try again.');
    } finally {
      setCitySearching(false);
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
          <Text style={styles.title}>Your Location & Costs</Text>
          <Text style={styles.subtitle}>
            Help us personalize your education plan by providing a few financial
            details and your location for local cost accuracy.
          </Text>

          {/* Country Selector */}
          <Text style={styles.inputLabel}>YOUR COUNTRY</Text>
          <Pressable
            testID="country-selector"
            style={styles.countrySelector}
            onPress={() => setShowCountryPicker(!showCountryPicker)}
          >
            <Text style={styles.countrySelectorText}>{countryConfig.name}</Text>
            <MaterialIcons
              name={showCountryPicker ? 'expand-less' : 'expand-more'}
              size={24}
              color={Colors.onSurfaceVariant}
            />
          </Pressable>
          {showCountryPicker && (
            <View style={styles.countryDropdown}>
              {(Object.keys(COUNTRY_CONFIGS) as CountryCode[]).map((code) => (
                <Pressable
                  key={code}
                  testID={`country-option-${code}`}
                  style={[
                    styles.countryOption,
                    code === countryCode && styles.countryOptionSelected,
                  ]}
                  onPress={() => {
                    setCountryCode(code);
                    setShowCountryPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.countryOptionText,
                      code === countryCode && styles.countryOptionTextSelected,
                    ]}
                  >
                    {COUNTRY_CONFIGS[code].name} ({COUNTRY_CONFIGS[code].currency.symbol})
                  </Text>
                  {code === countryCode && (
                    <MaterialIcons name="check" size={18} color={Colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>
          )}

          {/* Income */}
          <Input
            testID="income-input"
            label="MONTHLY HOUSEHOLD INCOME"
            prefix={currencySymbol}
            placeholder="0.00"
            value={incomeText}
            onChangeText={handleIncomeChange}
            error={incomeError ?? undefined}
            helper="Combined monthly income from all sources."
            keyboardType="decimal-pad"
          />

          {/* Savings */}
          <Input
            testID="savings-input"
            label="CURRENT EDUCATION SAVINGS"
            prefix={currencySymbol}
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
              <View>
                <View testID="location-status" style={styles.locationSuccess}>
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color={Colors.success}
                  />
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Pressable
                    testID="location-change"
                    onPress={() => setLocation(null)}
                    style={styles.changeLink}
                  >
                    <Text style={styles.changeLinkText}>Change</Text>
                  </Pressable>
                </View>
                <View testID="location-map" style={styles.mapPlaceholder}>
                  <MaterialIcons name="map" size={40} color={Colors.onSurfaceVariant} />
                  <Text style={styles.mapText}>
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.locationOptions}>
                <Button
                  testID="use-location-button"
                  title="Use Current Location"
                  onPress={handleUseLocation}
                  icon="my-location"
                  loading={locationLoading}
                />
                {locationDenied && (
                  <Text testID="location-status" style={styles.locationDenied}>
                    Location permission denied. Enter a city below instead.
                  </Text>
                )}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>
                <View style={styles.cityRow}>
                  <Input
                    testID="city-input"
                    label=""
                    placeholder="Enter a city (e.g. Mumbai, Jakarta)"
                    value={cityInput}
                    onChangeText={(t) => { setCityInput(t); setCityError(null); }}
                    error={cityError ?? undefined}
                    containerStyle={{ flex: 1 }}
                  />
                  <Button
                    testID="city-search-button"
                    title=""
                    icon="search"
                    onPress={handleCitySearch}
                    loading={citySearching}
                    disabled={!cityInput.trim()}
                    style={styles.citySearchBtn}
                  />
                </View>
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
  inputLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 1,
    borderColor: Colors.outlineLight,
    borderRadius: Radius.default,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  countrySelectorText: {
    ...Typography.body,
    fontWeight: '600',
  },
  countryDropdown: {
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 1,
    borderColor: Colors.outlineLight,
    borderRadius: Radius.default,
    marginTop: -Spacing.md,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineLight,
  },
  countryOptionSelected: {
    backgroundColor: Colors.primaryContainer,
  },
  countryOptionText: {
    ...Typography.body,
  },
  countryOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
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
    flex: 1,
  },
  changeLink: {
    marginLeft: 'auto',
  },
  changeLinkText: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 12,
  },
  locationOptions: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineLight,
  },
  dividerText: {
    ...Typography.muted,
    fontSize: 12,
    marginHorizontal: Spacing.md,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  citySearchBtn: {
    marginTop: 0,
    height: 48,
    width: 48,
    paddingHorizontal: 0,
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
