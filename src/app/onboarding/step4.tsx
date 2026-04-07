import { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Layout, Shadows } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { OnboardingHeader } from './_layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { SavingsResultCard } from '@/components/onboarding/SavingsResult';
import {
  calculateMonthlySavings,
  calculateFromAnnualCost,
  calculateWhatIf,
} from '@/services/calculator';
import { COUNTRY_CONFIGS } from '@/constants/countries';
import { formatCurrency, formatPercentage } from '@/utils/format';

export default function Step4Screen() {
  const {
    children,
    currentSavings,
    selectedTier,
    customAnnualCost,
    savingsResult,
    setSavingsResult,
    setCurrentStep,
    completeOnboarding,
    countryCode,
  } = useOnboardingStore();

  const countryConfig = COUNTRY_CONFIGS[countryCode];
  const countryTiers = countryConfig.schoolTiers;
  const currencySymbol = countryConfig.currency.symbol;

  // Calculate the baseline result
  useEffect(() => {
    if (children.length === 0) return;

    let result;
    if (customAnnualCost && customAnnualCost > 0) {
      result = calculateFromAnnualCost(
        children,
        currentSavings,
        customAnnualCost,
        countryConfig.inflationRate,
      );
    } else {
      if (!selectedTier) return;
      const tierData = countryTiers.find((t) => t.id === selectedTier);
      if (!tierData) return;
      result = calculateMonthlySavings(
        children,
        currentSavings,
        tierData,
        countryConfig.inflationRate,
      );
    }

    setSavingsResult(result);
  }, [selectedTier, customAnnualCost, children, currentSavings, countryCode]);

  // What-if local state (not persisted until confirmed)
  const [editingMonthly, setEditingMonthly] = useState(false);
  const [monthlyInput, setMonthlyInput] = useState('');
  const [editingCost, setEditingCost] = useState(false);
  const [costInput, setCostInput] = useState('');

  // Initialize local inputs when savingsResult arrives
  useEffect(() => {
    if (savingsResult) {
      setMonthlyInput(String(Math.round(savingsResult.totalMonthly)));
    }
  }, [savingsResult?.totalMonthly]);

  useEffect(() => {
    if (customAnnualCost) {
      setCostInput(String(customAnnualCost));
    } else if (selectedTier) {
      const tierData = countryTiers.find((t) => t.id === selectedTier);
      if (tierData) setCostInput(String(tierData.midpointCost));
    }
  }, [customAnnualCost, selectedTier]);

  const parsedMonthly = Number(monthlyInput) || 0;
  const parsedCost = Number(costInput) || 0;
  const baselineMonthly = savingsResult?.totalMonthly ?? 0;

  // Step amounts for +/- buttons (roughly 5% of baseline, rounded to nice number)
  const stepAmount = useMemo(() => {
    const raw = Math.max(baselineMonthly * 0.05, 100);
    const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
    return Math.round(raw / magnitude) * magnitude;
  }, [baselineMonthly]);

  const handleIncrement = () => {
    setMonthlyInput(String(parsedMonthly + stepAmount));
    setEditingMonthly(true);
  };

  const handleDecrement = () => {
    const next = Math.max(0, parsedMonthly - stepAmount);
    setMonthlyInput(String(next));
    setEditingMonthly(true);
  };

  // Real-time what-if calculation
  const whatIf = useMemo(() => {
    if (!editingMonthly && !editingCost) return null;
    if (parsedMonthly <= 0 || parsedCost <= 0 || children.length === 0) return null;

    return calculateWhatIf(
      parsedMonthly,
      parsedCost,
      countryConfig.inflationRate,
      children,
      currentSavings,
    );
  }, [parsedMonthly, parsedCost, editingMonthly, editingCost, children, currentSavings, countryConfig.inflationRate]);

  const isAdjusted = editingMonthly || editingCost;
  const currentYear = new Date().getFullYear();

  const handleBack = () => {
    setCurrentStep(3);
    router.back();
  };

  const handleConfirm = () => {
    // If user adjusted cost, update it in store
    if (editingCost && parsedCost > 0) {
      useOnboardingStore.getState().setCustomAnnualCost(parsedCost, 'user');
    }

    // Recalculate with final values and persist
    if (parsedCost > 0 && children.length > 0) {
      const finalResult = calculateFromAnnualCost(
        children,
        currentSavings,
        parsedCost,
        countryConfig.inflationRate,
      );
      setSavingsResult(finalResult);
    }

    completeOnboarding();
    router.replace('/(tabs)/horizon');
  };

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
        {/* Header */}
        <Text style={styles.title}>Your Monthly Savings Goal</Text>

        {/* Savings Result */}
        <SavingsResultCard result={savingsResult} countryCode={countryCode} />

        {/* What-If Section */}
        <View testID="what-if-section" style={styles.whatIfSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="tune" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Adjust Your Plan</Text>
          </View>

          {/* Monthly Savings Stepper */}
          <Text style={styles.fieldLabel}>MONTHLY SAVINGS</Text>
          <View style={styles.stepperRow}>
            <Pressable
              testID="monthly-decrement"
              onPress={handleDecrement}
              style={styles.stepperButton}
            >
              <MaterialIcons name="remove" size={22} color={Colors.primary} />
            </Pressable>

            <View style={styles.stepperInputWrap}>
              <Text style={styles.stepperPrefix}>{currencySymbol}</Text>
              <Input
                testID="monthly-savings-input"
                value={monthlyInput}
                onChangeText={(text) => {
                  setMonthlyInput(text.replace(/[^0-9]/g, ''));
                  setEditingMonthly(true);
                }}
                keyboardType="numeric"
                containerStyle={styles.stepperInputContainer}
              />
            </View>

            <Pressable
              testID="monthly-increment"
              onPress={handleIncrement}
              style={styles.stepperButton}
            >
              <MaterialIcons name="add" size={22} color={Colors.primary} />
            </Pressable>
          </View>

          {/* Change Cost Link */}
          <Pressable
            testID="change-cost-toggle"
            onPress={() => setEditingCost(!editingCost)}
            style={styles.changeCostToggle}
          >
            <MaterialIcons
              name={editingCost ? 'expand-less' : 'edit'}
              size={16}
              color={Colors.primary}
            />
            <Text style={styles.changeCostText}>
              {editingCost ? 'Hide cost editor' : 'Change annual cost'}
            </Text>
          </Pressable>

          {editingCost && (
            <Input
              testID="annual-cost-input-whatif"
              label="ANNUAL COST"
              prefix={currencySymbol}
              value={costInput}
              onChangeText={(text) => {
                setCostInput(text.replace(/[^0-9]/g, ''));
              }}
              keyboardType="numeric"
              containerStyle={{ marginBottom: Spacing.lg }}
            />
          )}

          {/* Comparison Card */}
          {isAdjusted && whatIf && (
            <Card
              testID="what-if-comparison"
              variant="filled"
              style={styles.comparisonCard}
            >
              <View style={styles.comparisonRow}>
                <View style={styles.comparisonCol}>
                  <Text style={styles.comparisonLabel}>Calculated Goal</Text>
                  <Text style={styles.comparisonValue}>
                    {formatCurrency(baselineMonthly, countryCode)}/mo
                  </Text>
                </View>
                <View style={styles.comparisonDivider} />
                <View style={styles.comparisonCol}>
                  <Text style={styles.comparisonLabel}>Your Plan</Text>
                  <Text style={[styles.comparisonValue, styles.comparisonHighlight]}>
                    {formatCurrency(parsedMonthly, countryCode)}/mo
                  </Text>
                </View>
              </View>

              {/* Impact */}
              <View style={styles.impactRow}>
                <MaterialIcons
                  name={whatIf.fullyFunded ? 'check-circle' : 'warning'}
                  size={18}
                  color={whatIf.fullyFunded ? Colors.success : Colors.warning}
                />
                <Text
                  testID="what-if-impact"
                  style={[
                    styles.impactText,
                    { color: whatIf.fullyFunded ? Colors.success : Colors.warning },
                  ]}
                >
                  {whatIf.fullyFunded
                    ? `Fully funded${whatIf.yearsToGoal !== null ? ` by ${currentYear + whatIf.yearsToGoal}` : ''}`
                    : `${whatIf.fundedPercent.toFixed(0)}% funded — shortfall of ${formatCurrency(whatIf.shortfall, countryCode)}`}
                </Text>
              </View>

              {/* Funded Progress Bar */}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(whatIf.fundedPercent, 100)}%`,
                      backgroundColor: whatIf.fullyFunded
                        ? Colors.success
                        : Colors.warning,
                    },
                  ]}
                />
              </View>
            </Card>
          )}
        </View>

        {/* Calculation Factors */}
        <View testID="calculation-factors" style={styles.factorsSection}>
          <View style={styles.factorsHeader}>
            <MaterialIcons name="calculate" size={20} color={Colors.primary} />
            <Text style={styles.factorsTitle}>Calculation Factors</Text>
          </View>

          <View style={styles.factorRow}>
            <MaterialIcons
              name="trending-up"
              size={18}
              color={Colors.onSurfaceVariant}
            />
            <View style={styles.factorText}>
              <Text style={styles.factorLabel}>Inflation Indexing</Text>
              <Text style={styles.factorDetail}>
                Adjusted for a {formatPercentage(countryConfig.inflationRate)}{' '}
                annual increase in education costs.
              </Text>
            </View>
          </View>

          <View style={styles.factorRow}>
            <MaterialIcons
              name="school"
              size={18}
              color={Colors.onSurfaceVariant}
            />
            <View style={styles.factorText}>
              <Text style={styles.factorLabel}>Annual Cost Basis</Text>
              <Text style={styles.factorDetail}>
                Based on {formatCurrency(parsedCost || (customAnnualCost ?? 0), countryCode)}/year
                per child.
              </Text>
            </View>
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
          title="Start Tracking"
          onPress={handleConfirm}
          icon="check"
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
  whatIfSection: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.cardHeading,
  },
  fieldLabel: {
    ...Typography.label,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.sm,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.default,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: Radius.default,
    paddingLeft: 16,
  },
  stepperPrefix: {
    ...Typography.input,
    color: Colors.onSurfaceVariant,
    marginRight: Spacing.xs,
  },
  stepperInputContainer: {
    flex: 1,
  },
  changeCostToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  changeCostText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  comparisonCard: {
    marginTop: Spacing.sm,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonCol: {
    flex: 1,
    alignItems: 'center',
  },
  comparisonDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.primaryLight,
  },
  comparisonLabel: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
  },
  comparisonValue: {
    ...Typography.cardHeading,
    fontSize: 15,
    color: Colors.onSurface,
  },
  comparisonHighlight: {
    color: Colors.primary,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.primaryLight,
  },
  impactText: {
    ...Typography.body,
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primaryContainer,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  factorsSection: {
    marginTop: Spacing.xl,
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
