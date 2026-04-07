import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Layout } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { OnboardingHeader } from './_layout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LocationCard } from '@/components/LocationCard';
import { COUNTRY_CONFIGS } from '@/constants/countries';
import { useSchoolSearch } from '@/hooks/useSchoolSearch';
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
    schoolResults,
    customAnnualCost,
    setCustomAnnualCost,
    setSchoolResults,
    setCurrentStep,
    setSearchStatus,
    setLastSearchLocation,
  } = useOnboardingStore();

  const { search, searchStatus, searchError } = useSchoolSearch();
  const searching = searchStatus === 'searching';

  const countryConfig = COUNTRY_CONFIGS[countryCode];
  const currencySymbol = countryConfig.currency.symbol;

  const groupedResults = useMemo(() => {
    if (schoolResults.length === 0) return null;
    return {
      public: schoolResults.filter((s) => s.type === 'public'),
      private: schoolResults.filter((s) => s.type === 'private'),
      international: schoolResults.filter((s) => s.type === 'international'),
    };
  }, [schoolResults]);

  // Custom cost input
  const [costInput, setCostInput] = useState(
    customAnnualCost ? String(customAnnualCost) : '',
  );

  const parsedCost = Number(costInput) || 0;
  const canProceed = selectedSchool !== null || parsedCost > 0;

  // Auto-search when location is set — hook handles dedup internally
  useEffect(() => {
    if (location) search();
  }, [location]);

  const handleLocationSet = (
    loc: { lat: number; lng: number; name: string },
    source: 'gps' | 'city',
    detectedCountryCode?: CountryCode,
  ) => {
    setLocation(loc, source, detectedCountryCode);
    if (detectedCountryCode) {
      setCountryCode(detectedCountryCode);
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
    setSchoolResults([]);
    setSelectedSchool(null);
    setSearchStatus('idle');
    setLastSearchLocation(null);
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
          <LocationCard
            location={location}
            countryConfig={countryConfig}
            onLocationSet={handleLocationSet}
            onChangeLocation={handleChangeLocation}
          />

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
              <Pressable onPress={() => search(true)} testID="retry-search">
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
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
  retryText: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
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

  // Dividers
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
