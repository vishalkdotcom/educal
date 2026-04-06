import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Layout, Shadows } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { OnboardingHeader } from './_layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SavingsResultCard } from '@/components/onboarding/SavingsResult';
import { calculateMonthlySavings } from '@/services/calculator';
import { SCHOOL_TIERS, DEFAULT_INFLATION_RATE, DEFAULT_GROWTH_RATE } from '@/constants/schools';
import { formatCurrency, formatPercentage } from '@/utils/format';

export default function Step4Screen() {
  const {
    children,
    currentSavings,
    selectedTier,
    savingsResult,
    setSavingsResult,
    setCurrentStep,
    completeOnboarding,
  } = useOnboardingStore();

  // Calculate savings on mount
  useEffect(() => {
    if (!selectedTier || children.length === 0) return;

    const tierData = SCHOOL_TIERS.find((t) => t.id === selectedTier);
    if (!tierData) return;

    const result = calculateMonthlySavings(children, currentSavings, tierData);
    setSavingsResult(result);
  }, [selectedTier, children, currentSavings]);

  const handleBack = () => {
    setCurrentStep(3);
    router.back();
  };

  const handleNext = () => {
    completeOnboarding();
    router.replace('/(tabs)/horizon');
  };

  const tierData = SCHOOL_TIERS.find((t) => t.id === selectedTier);

  if (!savingsResult) {
    return (
      <SafeAreaView style={styles.safe} testID="step4-screen">
        <OnboardingHeader step={4} />
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Calculating your savings plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} testID="step4-screen">
      <OnboardingHeader step={4} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Supertitle */}
        <Text style={styles.supertitle}>EDUCATION WEALTH REPORT</Text>
        <Text style={styles.title}>Your Monthly Savings Goal</Text>

        {/* Savings Result Component */}
        <SavingsResultCard result={savingsResult} />

        {/* Progress Ring Placeholder */}
        <View testID="savings-progress-ring" style={styles.progressRing}>
          <View style={styles.ringOuter}>
            <View style={styles.ringInner}>
              <Text style={styles.ringPercent}>100%</Text>
              <Text style={styles.ringLabel}>PROJECTED</Text>
            </View>
          </View>
        </View>

        {/* Target Year */}
        <View style={styles.targetRow}>
          <MaterialIcons name="trending-up" size={20} color={Colors.success} />
          <Text testID="savings-target-year" style={styles.targetText}>
            Target: {savingsResult.targetYear}
          </Text>
        </View>

        {/* Calculation Factors */}
        <View testID="calculation-factors" style={styles.factorsSection}>
          <View style={styles.factorsHeader}>
            <MaterialIcons name="calculate" size={20} color={Colors.primary} />
            <Text style={styles.factorsTitle}>Calculation Factors</Text>
          </View>

          <View style={styles.factorRow}>
            <MaterialIcons name="trending-up" size={18} color={Colors.onSurfaceVariant} />
            <View style={styles.factorText}>
              <Text style={styles.factorLabel}>Inflation Indexing</Text>
              <Text style={styles.factorDetail}>
                Adjusted for a {formatPercentage(DEFAULT_INFLATION_RATE)} annual
                increase in education costs.
              </Text>
            </View>
          </View>

          <View style={styles.factorRow}>
            <MaterialIcons name="school" size={18} color={Colors.onSurfaceVariant} />
            <View style={styles.factorText}>
              <Text style={styles.factorLabel}>Selected Schools</Text>
              <Text style={styles.factorDetail}>
                Based on {tierData?.label ?? 'selected tier'} averages & regional
                trends.
              </Text>
            </View>
          </View>

          <View style={styles.factorRow}>
            <MaterialIcons name="show-chart" size={18} color={Colors.onSurfaceVariant} />
            <View style={styles.factorText}>
              <Text style={styles.factorLabel}>Growth Assumptions</Text>
              <Text style={styles.factorDetail}>
                Conservative {formatPercentage(DEFAULT_GROWTH_RATE)} annual ROI on
                investment vehicle.
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Card */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Ready to Start?</Text>
          <Text style={styles.ctaSubtitle}>
            Lock in these rates by opening a tax-advantaged 529 plan today.
          </Text>
          <View style={styles.ctaButtons}>
            <Button
              testID="cta-get-started"
              title="Get Started"
              variant="outlined"
              onPress={handleNext}
              style={styles.ctaBtn}
              textStyle={{ color: '#FFFFFF' }}
            />
            <Button
              testID="cta-talk-advisor"
              title="Talk to Advisor"
              onPress={() => {}}
              style={{ ...styles.ctaBtn, backgroundColor: '#FFFFFF' }}
              textStyle={{ color: Colors.primary }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Button
          testID="step4-back-button"
          title="BACK"
          variant="text"
          onPress={handleBack}
          icon="arrow-back"
        />
        <Button
          testID="step4-next-button"
          title="SEE YOUR PLAN"
          onPress={handleNext}
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
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.muted,
  },
  supertitle: {
    ...Typography.label,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  title: {
    ...Typography.screenTitle,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  progressRing: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  ringOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    alignItems: 'center',
  },
  ringPercent: {
    ...Typography.cardHeading,
    fontSize: 22,
    color: Colors.primary,
  },
  ringLabel: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  targetText: {
    ...Typography.label,
    color: Colors.success,
  },
  factorsSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineLight,
  },
  factorsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  factorsTitle: {
    ...Typography.cardHeading,
  },
  factorRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  factorText: {
    flex: 1,
  },
  factorLabel: {
    ...Typography.body,
    fontWeight: '600',
    fontSize: 14,
  },
  factorDetail: {
    ...Typography.muted,
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  ctaCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.default,
    padding: Spacing.xl,
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  ctaTitle: {
    ...Typography.cardHeading,
    color: '#FFFFFF',
    fontSize: 20,
  },
  ctaSubtitle: {
    ...Typography.muted,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  ctaBtn: {
    flex: 1,
    borderColor: '#FFFFFF',
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
