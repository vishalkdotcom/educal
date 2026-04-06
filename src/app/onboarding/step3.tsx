import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Layout, Shadows } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { OnboardingHeader } from './_layout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SchoolTierCard } from '@/components/onboarding/SchoolTierCard';
import { SCHOOL_TIERS } from '@/constants/schools';
import { COUNTRY_CONFIGS } from '@/constants/countries';
import { searchSchoolsWithGemini } from '@/services/gemini';
import { formatPercentage } from '@/utils/format';
import type { SchoolTier, SchoolTierId } from '@/types';

export default function Step3Screen() {
  const {
    children,
    location,
    currentSavings,
    selectedTier,
    setSelectedTier,
    setSchoolResults,
    setCurrentStep,
    countryCode,
  } = useOnboardingStore();

  const countryTiers = COUNTRY_CONFIGS[countryCode].schoolTiers;
  const [tiers, setTiers] = useState<SchoolTier[]>(countryTiers);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<'gemini' | 'fallback'>('fallback');

  // Fetch school data from Gemini on mount
  useEffect(() => {
    if (!location) return;

    const fetchSchools = async () => {
      setLoading(true);
      try {
        const childAges = children.map((c) => c.currentAge);
        const targetLevels = children.map((c) => c.targetLevel);

        const results = await Promise.all(
          (['public', 'private', 'international'] as SchoolTierId[]).map(
            (tier) =>
              searchSchoolsWithGemini({
                latitude: location.lat,
                longitude: location.lng,
                tier,
                childAges,
                targetLevels,
                countryCode,
              }),
          ),
        );

        const updatedTiers = countryTiers.map((tier, i) => ({
          ...tier,
          schools: results[i].length > 0 ? results[i] : tier.schools,
        }));

        setTiers(updatedTiers);
        setDataSource(results.some((r) => r[0]?.source === 'gemini') ? 'gemini' : 'fallback');

        // Store all results in the store
        const allSchools = results.flat();
        setSchoolResults(allSchools);
      } catch {
        setDataSource('fallback');
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [location]);

  const selectedTierData = tiers.find((t) => t.id === selectedTier);

  // Calculate cost projection impact
  const projectionIncrease = selectedTierData
    ? Math.min(
        ((selectedTierData.midpointCost - currentSavings) /
          Math.max(currentSavings, 1)) *
          100,
        999,
      )
    : 0;

  const handleBack = () => {
    setCurrentStep(2);
    router.back();
  };

  const handleNext = () => {
    if (!selectedTier) return;
    setCurrentStep(4);
    router.push('/onboarding/step4');
  };

  const districtName = location?.name ?? 'your area';

  return (
    <SafeAreaView style={styles.safe} testID="step3-screen">
      <OnboardingHeader step={3} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress */}
        <ProgressBar
          testID="step3-progress-bar"
          progress={0.75}
          label="SETUP PROGRESS"
        />

        {/* Heading */}
        <Text style={styles.title}>Select Education Goal</Text>

        {/* Nearby Schools Banner */}
        <View testID="nearby-schools-banner" style={styles.banner}>
          <MaterialIcons name="location-city" size={28} color="#FFFFFF" />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>
              {location
                ? `Nearby Schools in ${districtName}`
                : 'Schools Matching Your Profile'}
            </Text>
            <Text style={styles.bannerSubtitle}>
              {loading
                ? 'Searching for institutions...'
                : `We've identified institutions matching your financial profile.`}
            </Text>
          </View>
        </View>

        {/* Loading State */}
        {loading && (
          <View testID="step3-loading" style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Finding schools near you...</Text>
          </View>
        )}

        {/* Data Source Badge */}
        {!loading && dataSource === 'fallback' && location && (
          <View style={styles.dataBadge}>
            <MaterialIcons name="info-outline" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.dataBadgeText}>Using estimated data</Text>
          </View>
        )}

        {/* School Tier Cards */}
        {!loading &&
          tiers.map((tier) => (
            <View key={tier.id} style={styles.tierWrap}>
              <SchoolTierCard
                testID={`tier-card-${tier.id}`}
                tier={tier}
                selected={selectedTier === tier.id}
                onSelect={setSelectedTier}
                countryCode={countryCode}
              />
            </View>
          ))}

        {/* Cost Projection Card */}
        {selectedTierData && (
          <Card
            testID="cost-projection-card"
            variant="filled"
            style={styles.projectionCard}
          >
            <Text style={styles.projectionText}>
              Based on your current savings rate, a{' '}
              <Text style={{ fontWeight: '700' }}>
                {selectedTierData.label}
              </Text>{' '}
              goal would require adjusting your monthly contributions.
            </Text>
            <View style={styles.forecastRow}>
              <Text style={styles.forecastLabel}>Growth Forecast</Text>
              <Text
                testID="growth-forecast-value"
                style={styles.forecastValue}
              >
                +8.2%
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Button
          testID="step3-back-button"
          title="BACK"
          variant="text"
          onPress={handleBack}
          icon="arrow-back"
        />
        <Button
          testID="step3-next-button"
          title="NEXT"
          onPress={handleNext}
          disabled={!selectedTier}
          icon="arrow-forward"
          iconPosition="right"
          style={{ flex: 1, marginLeft: Spacing.md }}
        />
      </View>
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
    marginBottom: Spacing.lg,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.default,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    ...Typography.cardHeading,
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    ...Typography.muted,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.muted,
  },
  dataBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  dataBadgeText: {
    ...Typography.muted,
    fontSize: 12,
  },
  tierWrap: {
    marginBottom: Spacing.md,
  },
  projectionCard: {
    marginTop: Spacing.sm,
  },
  projectionText: {
    ...Typography.muted,
    color: Colors.primaryDark,
    lineHeight: 20,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.primaryLight,
  },
  forecastLabel: {
    ...Typography.label,
    color: Colors.primaryDark,
  },
  forecastValue: {
    ...Typography.cardHeading,
    color: Colors.success,
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
