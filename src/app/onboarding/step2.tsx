import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Colors, Typography, Spacing, Radius, Layout } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { OnboardingHeader } from './_layout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { COUNTRY_CONFIGS } from '@/constants/countries';
import { searchAllSchoolTiers } from '@/services/gemini';
import { detectCountryFromCoordinates, geocodeCityToLocation } from '@/utils/location';
import { formatCurrency } from '@/utils/format';
import type { CountryCode, SchoolResult, SchoolTierId } from '@/types';

export default function Step2Screen() {
  const {
    children,
    countryCode,
    setCountryCode,
    location,
    setLocation,
    selectedSchool,
    setSelectedSchool,
    customAnnualCost,
    setCustomAnnualCost,
    setSchoolResults,
    setCurrentStep,
  } = useOnboardingStore();

  const countryConfig = COUNTRY_CONFIGS[countryCode];
  const currencySymbol = countryConfig.currency.symbol;

  // Location state
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [citySearching, setCitySearching] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);

  // School search state
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [groupedResults, setGroupedResults] = useState<{
    public: SchoolResult[];
    private: SchoolResult[];
    international: SchoolResult[];
  } | null>(null);

  // Custom cost input
  const [costInput, setCostInput] = useState(
    customAnnualCost ? String(customAnnualCost) : '',
  );

  const parsedCost = Number(costInput) || 0;
  const canProceed = selectedSchool !== null || parsedCost > 0;

  // Auto-search when location is set
  const searchSchools = useCallback(async () => {
    if (!location) return;

    setSearching(true);
    setSearchError(null);

    try {
      // Auto-detect country from coordinates
      const detected = await detectCountryFromCoordinates(location.lat, location.lng);
      if (detected) {
        setCountryCode(detected.countryCode);
      }

      const childAges = children.map((c) => c.currentAge);
      const targetLevels = children.map((c) => c.targetLevel);

      const results = await searchAllSchoolTiers(
        location.lat,
        location.lng,
        detected?.countryCode ?? countryCode,
        childAges,
        targetLevels,
      );

      setGroupedResults(results);

      // Store flat results
      const allSchools = [...results.public, ...results.private, ...results.international];
      if (allSchools.length > 0) {
        setSchoolResults(allSchools);
      }

      // Check if any results came from Gemini
      const hasGemini = allSchools.some((s) => s.source === 'gemini');
      if (!hasGemini && allSchools.length === 0) {
        setSearchError("We couldn't find schools near you. Enter a cost below instead.");
      }
    } catch {
      setSearchError("Search failed. You can enter a cost manually below.");
    } finally {
      setSearching(false);
    }
  }, [location, children, countryCode]);

  useEffect(() => {
    if (location && !groupedResults && !searching) {
      searchSchools();
    }
  }, [location]);

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

      // Auto-detect country
      const detected = geocode?.isoCountryCode
        ? await detectCountryFromCoordinates(loc.coords.latitude, loc.coords.longitude)
        : null;

      setLocation(
        { lat: loc.coords.latitude, lng: loc.coords.longitude, name },
        'gps',
        detected?.countryCode,
      );
      setLocationDenied(false);
    } catch {
      Alert.alert('Location Error', 'Unable to get your location. Try entering a city instead.');
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
      const result = await geocodeCityToLocation(query);
      if (!result) {
        setCityError('Could not find that location. Try a different city name.');
        return;
      }

      const detected = await detectCountryFromCoordinates(result.lat, result.lng);
      setLocation(
        { lat: result.lat, lng: result.lng, name: result.name },
        'city',
        detected?.countryCode,
      );
      setLocationDenied(false);
    } catch {
      setCityError('Search failed. Check your connection and try again.');
    } finally {
      setCitySearching(false);
    }
  };

  const handleSelectSchool = (school: SchoolResult) => {
    setSelectedSchool(school);
    setCostInput(String(school.annualTuition));
    setCustomAnnualCost(school.annualTuition, 'gemini');
  };

  const handleCostChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, '');
    setCostInput(clean);
    setSelectedSchool(null); // custom cost deselects school
  };

  const handleChangeLocation = () => {
    setLocation(null);
    setGroupedResults(null);
    setSelectedSchool(null);
    setSearchError(null);
  };

  const handleBack = () => {
    setCurrentStep(1);
    router.back();
  };

  const handleNext = () => {
    if (!canProceed) return;

    // Save cost
    if (selectedSchool) {
      setCustomAnnualCost(selectedSchool.annualTuition, 'gemini');
    } else if (parsedCost > 0) {
      setCustomAnnualCost(parsedCost, 'user');
    }

    setCurrentStep(3);
    router.push('/onboarding/step3');
  };

  const renderSchoolGroup = (
    label: string,
    schools: SchoolResult[],
    tierId: SchoolTierId,
  ) => {
    if (schools.length === 0) return null;
    return (
      <View key={tierId} style={styles.schoolGroup}>
        <Text style={styles.groupLabel}>{label}</Text>
        {schools.map((school, i) => {
          const isSelected = selectedSchool?.name === school.name && selectedSchool?.type === school.type;
          return (
            <Pressable
              key={`${school.name}-${i}`}
              testID={`school-option-${tierId}-${i}`}
              onPress={() => handleSelectSchool(school)}
              style={[styles.schoolRow, isSelected && styles.schoolRowSelected]}
            >
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
              <View style={styles.schoolInfo}>
                <Text style={[styles.schoolName, isSelected && styles.schoolNameSelected]} numberOfLines={1}>
                  {school.name}
                </Text>
              </View>
              <Text style={[styles.schoolCost, isSelected && styles.schoolCostSelected]}>
                {formatCurrency(school.annualTuition, countryCode)}/yr
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
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
            progress={0.66}
            label="SETUP PROGRESS"
          />

          {/* Heading */}
          <Text style={styles.title}>Where will they study?</Text>
          <Text style={styles.subtitle}>
            We'll find schools and costs near you.
          </Text>

          {/* Location Section */}
          <Card variant="outlined" style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <MaterialIcons name="location-on" size={24} color={Colors.primary} />
              <Text style={styles.locationTitle}>Your Location</Text>
            </View>

            {location ? (
              <View testID="location-status" style={styles.locationSuccess}>
                <MaterialIcons name="check-circle" size={20} color={Colors.success} />
                <View style={styles.locationTextWrap}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.countryDetected}>
                    {countryConfig.name} {countryConfig.currency.symbol}
                  </Text>
                </View>
                <Pressable
                  testID="location-change"
                  onPress={handleChangeLocation}
                  style={styles.changeLink}
                >
                  <Text style={styles.changeLinkText}>Change</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.locationOptions}>
                <Button
                  testID="use-location-button"
                  title="Use my location"
                  onPress={handleUseLocation}
                  icon="my-location"
                  loading={locationLoading}
                />
                {locationDenied && (
                  <Text testID="location-denied" style={styles.locationDenied}>
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

          {/* School Results */}
          {searching && (
            <View testID="school-search-loading" style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>
                Finding schools near {location?.name ?? 'you'}...
              </Text>
            </View>
          )}

          {!searching && searchError && (
            <View style={styles.errorBanner}>
              <MaterialIcons name="info-outline" size={18} color={Colors.warning} />
              <Text style={styles.errorText}>{searchError}</Text>
            </View>
          )}

          {!searching && groupedResults && (
            <View testID="school-results" style={styles.resultsSection}>
              {renderSchoolGroup('Public Schools', groupedResults.public, 'public')}
              {renderSchoolGroup('Private Schools', groupedResults.private, 'private')}
              {renderSchoolGroup('International Schools', groupedResults.international, 'international')}

              {/* Data source badge */}
              {groupedResults.public.length > 0 && (
                <View style={styles.sourceBadge}>
                  <MaterialIcons
                    name={groupedResults.public[0]?.source === 'gemini' ? 'auto-awesome' : 'info-outline'}
                    size={14}
                    color={Colors.onSurfaceVariant}
                  />
                  <Text style={styles.sourceText}>
                    {groupedResults.public[0]?.source === 'gemini'
                      ? 'Costs from AI search — estimates only'
                      : `Average costs for ${countryConfig.name}`}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Custom Cost Input */}
          {(location || !canProceed) && (
            <View style={styles.customCostSection}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or enter your own</Text>
                <View style={styles.dividerLine} />
              </View>
              <Input
                testID="annual-cost-input"
                label="ANNUAL COST"
                prefix={currencySymbol}
                value={costInput}
                onChangeText={handleCostChange}
                keyboardType="numeric"
                placeholder="Enter expected annual cost"
                helper="Total annual tuition and fees per child"
              />
            </View>
          )}
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
            disabled={!canProceed}
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

  // Location
  locationCard: {
    marginBottom: Spacing.md,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  locationTitle: {
    ...Typography.cardHeading,
  },
  locationSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: '#F0FDF4',
    borderRadius: Radius.default,
  },
  locationTextWrap: {
    flex: 1,
  },
  locationName: {
    ...Typography.body,
    color: Colors.success,
    fontWeight: '600',
  },
  countryDetected: {
    ...Typography.muted,
    fontSize: 12,
    marginTop: 2,
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
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  locationDenied: {
    ...Typography.muted,
    fontSize: 12,
    color: Colors.warning,
    marginTop: Spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
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

  // School results
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.muted,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#FFFBEB',
    padding: Spacing.md,
    borderRadius: Radius.default,
    marginVertical: Spacing.md,
  },
  errorText: {
    ...Typography.muted,
    fontSize: 13,
    flex: 1,
    color: Colors.warning,
  },
  resultsSection: {
    marginTop: Spacing.md,
  },
  schoolGroup: {
    marginBottom: Spacing.lg,
  },
  groupLabel: {
    ...Typography.label,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.sm,
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceWhite,
    borderRadius: Radius.default,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.outlineLight,
  },
  schoolRowSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryContainer,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.outlineLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  schoolInfo: {
    flex: 1,
  },
  schoolName: {
    ...Typography.body,
    fontSize: 14,
    fontWeight: '500',
  },
  schoolNameSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  schoolCost: {
    ...Typography.label,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginLeft: Spacing.sm,
  },
  schoolCostSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  sourceText: {
    ...Typography.muted,
    fontSize: 11,
  },

  // Custom cost
  customCostSection: {
    marginTop: Spacing.sm,
  },

  // Bottom bar
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
