import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Layout, Shadows } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { OnboardingHeader } from './_layout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { COUNTRY_CONFIGS } from '@/constants/countries';
import { searchSchoolsWithGemini } from '@/services/gemini';
import { formatCurrencyCompact } from '@/utils/format';
import type { SchoolTier, SchoolTierId } from '@/types';

export default function Step3Screen() {
  const {
    children,
    location,
    currentSavings,
    selectedTier,
    customAnnualCost,
    setSelectedTier,
    setCustomAnnualCost,
    setSchoolResults,
    setCurrentStep,
    countryCode,
  } = useOnboardingStore();

  const countryConfig = COUNTRY_CONFIGS[countryCode];
  const countryTiers = countryConfig.schoolTiers;
  const currencySymbol = countryConfig.currency.symbol;

  // Local state for cost input
  const [costInput, setCostInput] = useState(
    customAnnualCost ? String(customAnnualCost) : '',
  );
  const [activeTierPick, setActiveTierPick] = useState<SchoolTierId | null>(
    selectedTier,
  );

  // Gemini research state
  const [researchOpen, setResearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [geminiResults, setGeminiResults] = useState<
    { tierLabel: string; schools: { name: string; annualTuition: number }[] }[]
  >([]);
  const [dataSource, setDataSource] = useState<'gemini' | 'fallback'>('fallback');

  const parsedCost = Number(costInput) || 0;

  const handleTierPick = (tier: SchoolTier) => {
    setActiveTierPick(tier.id);
    setCostInput(String(tier.midpointCost));
  };

  const handleGeminiUseAmount = (amount: number) => {
    setCostInput(String(amount));
    setActiveTierPick(null);
  };

  // Fetch school data from Gemini
  const handleResearch = async () => {
    setResearchOpen(true);
    if (geminiResults.length > 0 || !location) return;

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

      const mapped = countryTiers.map((tier, i) => ({
        tierLabel: tier.label,
        schools: results[i].length > 0
          ? results[i].map((s) => ({ name: s.name, annualTuition: s.annualTuition }))
          : tier.schools.map((s) => ({ name: s.name, annualTuition: s.annualTuition })),
      }));

      setGeminiResults(mapped);
      setDataSource(results.some((r) => r[0]?.source === 'gemini') ? 'gemini' : 'fallback');

      // Store all results
      const allSchools = results.flat();
      if (allSchools.length > 0) {
        setSchoolResults(allSchools);
      }
    } catch {
      setDataSource('fallback');
      // Show fallback data
      const mapped = countryTiers.map((tier) => ({
        tierLabel: tier.label,
        schools: tier.schools.map((s) => ({ name: s.name, annualTuition: s.annualTuition })),
      }));
      setGeminiResults(mapped);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(2);
    router.back();
  };

  const handleNext = () => {
    if (parsedCost <= 0) return;

    // Determine source
    const source = activeTierPick ? 'tier' : 'user';
    setCustomAnnualCost(parsedCost, source);

    // Also set selectedTier if a tier was picked (for backward compat)
    if (activeTierPick) {
      setSelectedTier(activeTierPick);
    }

    setCurrentStep(4);
    router.push('/onboarding/step4');
  };

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
        <Text style={styles.title}>Expected Education Cost</Text>
        <Text style={styles.subtitle}>
          How much do you expect to pay per year for education?
        </Text>

        {/* Cost Input */}
        <Input
          testID="annual-cost-input"
          label="ANNUAL COST"
          prefix={currencySymbol}
          value={costInput}
          onChangeText={(text) => {
            setCostInput(text.replace(/[^0-9]/g, ''));
            setActiveTierPick(null);
          }}
          keyboardType="numeric"
          placeholder="Enter expected annual cost"
          helper="Total annual tuition and fees per child"
        />

        {/* Quick-Pick Tier Chips */}
        <Text style={styles.quickPickLabel}>QUICK ESTIMATE</Text>
        <View style={styles.chipRow}>
          {countryTiers.map((tier) => {
            const isActive = activeTierPick === tier.id;
            return (
              <Pressable
                key={tier.id}
                testID={`tier-chip-${tier.id}`}
                onPress={() => handleTierPick(tier)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <MaterialIcons
                  name={tier.icon as keyof typeof MaterialIcons.glyphMap}
                  size={16}
                  color={isActive ? '#FFFFFF' : Colors.primary}
                />
                <View style={styles.chipTextWrap}>
                  <Text
                    style={[styles.chipLabel, isActive && styles.chipLabelActive]}
                    numberOfLines={1}
                  >
                    {tier.label}
                  </Text>
                  <Text
                    style={[styles.chipCost, isActive && styles.chipCostActive]}
                  >
                    ~{formatCurrencyCompact(tier.midpointCost, countryCode)}/yr
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Research Section */}
        <Pressable
          testID="research-toggle"
          onPress={handleResearch}
          style={styles.researchToggle}
        >
          <MaterialIcons
            name={researchOpen ? 'expand-less' : 'search'}
            size={20}
            color={Colors.primary}
          />
          <Text style={styles.researchToggleText}>
            {researchOpen ? 'Hide research' : 'Help me research school costs'}
          </Text>
        </Pressable>

        {researchOpen && (
          <View testID="research-section" style={styles.researchSection}>
            {loading && (
              <View testID="step3-loading" style={styles.loadingWrap}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>
                  Searching for schools near you...
                </Text>
              </View>
            )}

            {!loading && !location && (
              <View style={styles.noLocationWrap}>
                <MaterialIcons
                  name="location-off"
                  size={24}
                  color={Colors.onSurfaceVariant}
                />
                <Text style={styles.noLocationText}>
                  Add your location in Step 2 to get local school cost data.
                </Text>
              </View>
            )}

            {!loading && dataSource === 'fallback' && location && (
              <View style={styles.dataBadge}>
                <MaterialIcons
                  name="info-outline"
                  size={14}
                  color={Colors.onSurfaceVariant}
                />
                <Text style={styles.dataBadgeText}>
                  Using estimated data for your area
                </Text>
              </View>
            )}

            {!loading &&
              geminiResults.map((group) => (
                <View key={group.tierLabel} style={styles.researchGroup}>
                  <Text style={styles.researchGroupLabel}>{group.tierLabel}</Text>
                  {group.schools.map((school) => (
                    <Pressable
                      key={school.name}
                      testID={`research-school-${school.name.replace(/\s+/g, '-').toLowerCase()}`}
                      onPress={() => handleGeminiUseAmount(school.annualTuition)}
                      style={styles.schoolRow}
                    >
                      <View style={styles.schoolInfo}>
                        <Text style={styles.schoolName} numberOfLines={1}>
                          {school.name}
                        </Text>
                        <Text style={styles.schoolCost}>
                          {formatCurrencyCompact(school.annualTuition, countryCode)}
                          /yr
                        </Text>
                      </View>
                      <View style={styles.useButton}>
                        <Text style={styles.useButtonText}>Use</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              ))}
          </View>
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
          disabled={parsedCost <= 0}
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.muted,
    marginBottom: Spacing.lg,
  },
  quickPickLabel: {
    ...Typography.label,
    color: Colors.onSurfaceVariant,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  chipRow: {
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.default,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipTextWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipLabel: {
    ...Typography.body,
    fontWeight: '600',
    fontSize: 14,
    color: Colors.onSurface,
    flex: 1,
  },
  chipLabelActive: {
    color: '#FFFFFF',
  },
  chipCost: {
    ...Typography.label,
    fontSize: 13,
    color: Colors.primary,
  },
  chipCostActive: {
    color: 'rgba(255,255,255,0.85)',
  },
  researchToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  researchToggleText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  researchSection: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineLight,
  },
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.muted,
  },
  noLocationWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  noLocationText: {
    ...Typography.muted,
    textAlign: 'center',
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
  researchGroup: {
    marginBottom: Spacing.lg,
  },
  researchGroupLabel: {
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
  schoolInfo: {
    flex: 1,
  },
  schoolName: {
    ...Typography.body,
    fontSize: 14,
    fontWeight: '500',
  },
  schoolCost: {
    ...Typography.muted,
    fontSize: 13,
    marginTop: 2,
  },
  useButton: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.default,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  useButtonText: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 12,
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
