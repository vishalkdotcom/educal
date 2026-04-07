import { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Layout, Shadows } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { OnboardingHeader } from './_layout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  calculateFromAnnualCost,
  calculateWhatIf,
} from '@/services/calculator';
import { COUNTRY_CONFIGS } from '@/constants/countries';
import { formatCurrency, formatPercentage } from '@/utils/format';

export default function Step3Screen() {
  const {
    children,
    countryCode,
    monthlyIncome,
    setMonthlyIncome,
    currentSavings,
    setCurrentSavings,
    customAnnualCost,
    savingsResult,
    setSavingsResult,
    completeOnboarding,
    setCurrentStep,
  } = useOnboardingStore();

  const countryConfig = COUNTRY_CONFIGS[countryCode];
  const currencySymbol = countryConfig.currency.symbol;
  const annualCost = customAnnualCost ?? 0;

  // Income & savings local state
  const [incomeText, setIncomeText] = useState(
    monthlyIncome > 0 ? monthlyIncome.toString() : '',
  );
  const [savingsText, setSavingsText] = useState(
    currentSavings > 0 ? currentSavings.toString() : '',
  );

  // Calculate baseline on mount and when inputs change
  useEffect(() => {
    if (children.length === 0 || annualCost <= 0) return;
    const result = calculateFromAnnualCost(
      children,
      currentSavings,
      annualCost,
      countryConfig.inflationRate,
    );
    setSavingsResult(result);
  }, [children, currentSavings, annualCost, countryCode]);

  // What-if state
  const [monthlyInput, setMonthlyInput] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  // Initialize monthly input from baseline
  useEffect(() => {
    if (savingsResult && !adjusting) {
      setMonthlyInput(String(Math.round(savingsResult.totalMonthly)));
    }
  }, [savingsResult?.totalMonthly]);

  const parsedMonthly = Number(monthlyInput) || 0;
  const baselineMonthly = savingsResult?.totalMonthly ?? 0;
  const currentYear = new Date().getFullYear();

  // Step amount for +/- buttons
  const stepAmount = useMemo(() => {
    const raw = Math.max(baselineMonthly * 0.05, 100);
    const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
    return Math.round(raw / magnitude) * magnitude;
  }, [baselineMonthly]);

  const handleIncrement = () => {
    setMonthlyInput(String(parsedMonthly + stepAmount));
    setAdjusting(true);
  };

  const handleDecrement = () => {
    setMonthlyInput(String(Math.max(0, parsedMonthly - stepAmount)));
    setAdjusting(true);
  };

  // What-if calculation
  const whatIf = useMemo(() => {
    if (!adjusting || parsedMonthly <= 0 || annualCost <= 0 || children.length === 0) return null;
    return calculateWhatIf(parsedMonthly, annualCost, countryConfig.inflationRate, children, currentSavings);
  }, [parsedMonthly, adjusting, annualCost, children, currentSavings, countryConfig.inflationRate]);

  // Contextual feedback
  const incomePercent = monthlyIncome > 0 && baselineMonthly > 0
    ? ((baselineMonthly / monthlyIncome) * 100).toFixed(1)
    : null;

  const savingsYearsCovered = useMemo(() => {
    if (currentSavings <= 0 || annualCost <= 0) return null;
    const years = Math.floor(currentSavings / annualCost);
    return years > 0 ? years : null;
  }, [currentSavings, annualCost]);

  // Funding status color
  const getFundingColor = (percent: number) => {
    if (percent >= 100) return Colors.success;
    if (percent >= 50) return Colors.warning;
    return '#EF4444'; // red
  };

  const displayPercent = adjusting && whatIf
    ? whatIf.fundedPercent
    : savingsResult
      ? savingsResult.currentFunded
      : 0;

  const handleIncomeChange = (text: string) => {
    const clean = text.replace(/[^0-9.]/g, '');
    setIncomeText(clean);
    const num = parseFloat(clean);
    if (!isNaN(num)) setMonthlyIncome(num);
  };

  const handleSavingsChange = (text: string) => {
    const clean = text.replace(/[^0-9.]/g, '');
    setSavingsText(clean);
    const num = parseFloat(clean);
    if (!isNaN(num)) setCurrentSavings(num);
  };

  const handleBack = () => {
    setCurrentStep(2);
    router.back();
  };

  const handleConfirm = () => {
    // Final recalculate with current values
    if (annualCost > 0 && children.length > 0) {
      const finalResult = calculateFromAnnualCost(
        children,
        currentSavings,
        annualCost,
        countryConfig.inflationRate,
      );
      setSavingsResult(finalResult);
    }
    completeOnboarding();
    router.replace('/(tabs)/home');
  };

  // Narrative text
  const childNames = children.map((c) => c.name).join(' and ');
  const targetYear = savingsResult?.targetYear ?? currentYear + 10;
  const projectedTotal = savingsResult?.projectedTotal ?? 0;

  return (
    <SafeAreaView style={styles.safe} testID="step3-screen">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <OnboardingHeader step={3} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress */}
          <ProgressBar
            testID="step3-progress-bar"
            progress={1.0}
            label="SETUP PROGRESS"
          />

          {/* Heading */}
          <Text style={styles.title}>Your Savings Plan</Text>

          {/* Narrative */}
          {projectedTotal > 0 && (
            <Text style={styles.narrative}>
              To fund {childNames}'s education by {targetYear}, you'll need
              approximately {formatCurrency(projectedTotal, countryCode)} total.
            </Text>
          )}

          {/* Hero Monthly Amount */}
          {savingsResult && (
            <Card variant="elevated" style={styles.heroCard} testID="savings-hero">
              <Text testID="savings-goal-amount" style={styles.heroAmount}>
                {formatCurrency(savingsResult.totalMonthly, countryCode)}
                <Text style={styles.heroUnit}>/month</Text>
              </Text>
              <Text style={styles.heroSubtext}>
                covers 100% of projected costs
              </Text>
            </Card>
          )}

          {/* Income Section */}
          <Text style={styles.sectionLabel}>HOW MUCH CAN YOU CONTRIBUTE?</Text>

          <Input
            testID="income-input"
            label="MONTHLY HOUSEHOLD INCOME"
            prefix={currencySymbol}
            placeholder="0"
            value={incomeText}
            onChangeText={handleIncomeChange}
            keyboardType="decimal-pad"
            helper="Combined monthly income from all sources."
          />
          {incomePercent && (
            <Text testID="income-percent-hint" style={styles.contextHint}>
              That's about {incomePercent}% of your income
            </Text>
          )}

          <Input
            testID="savings-input"
            label="CURRENT EDUCATION SAVINGS"
            prefix={currencySymbol}
            placeholder="0"
            value={savingsText}
            onChangeText={handleSavingsChange}
            keyboardType="decimal-pad"
            containerStyle={{ marginTop: Spacing.md }}
          />
          {savingsYearsCovered && (
            <Text testID="savings-years-hint" style={styles.contextHint}>
              Great — that covers the first {savingsYearsCovered} {savingsYearsCovered === 1 ? 'year' : 'years'}!
            </Text>
          )}

          {/* What-If Stepper */}
          <View testID="what-if-section" style={styles.whatIfSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="tune" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Adjust to your reality</Text>
            </View>

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
                    setAdjusting(true);
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

            {/* Funding Status Card */}
            {adjusting && whatIf && (
              <Card
                testID="what-if-comparison"
                variant="filled"
                style={styles.fundingCard}
              >
                <Text style={styles.fundingLabel}>
                  At {formatCurrency(parsedMonthly, countryCode)}/mo
                </Text>

                {/* Progress Bar */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(whatIf.fundedPercent, 100)}%`,
                        backgroundColor: getFundingColor(whatIf.fundedPercent),
                      },
                    ]}
                  />
                </View>

                <View style={styles.fundingRow}>
                  <MaterialIcons
                    name={whatIf.fullyFunded ? 'check-circle' : 'warning'}
                    size={18}
                    color={getFundingColor(whatIf.fundedPercent)}
                  />
                  <Text
                    testID="what-if-impact"
                    style={[
                      styles.fundingText,
                      { color: getFundingColor(whatIf.fundedPercent) },
                    ]}
                  >
                    {whatIf.fullyFunded
                      ? `Fully funded${whatIf.yearsToGoal !== null ? ` by ${currentYear + whatIf.yearsToGoal}` : ''}`
                      : `${whatIf.fundedPercent.toFixed(0)}% funded — shortfall of ${formatCurrency(whatIf.shortfall, countryCode)}`}
                  </Text>
                </View>
              </Card>
            )}
          </View>

          {/* Per-Child Breakdown */}
          {savingsResult && savingsResult.perChild.length > 0 && (
            <View style={styles.breakdownSection}>
              {savingsResult.perChild.map((child, index) => (
                <Card
                  key={child.childId}
                  testID={`child-breakdown-${index}`}
                  variant="outlined"
                  style={styles.childCard}
                >
                  <View style={styles.childRow}>
                    <View style={styles.childAvatar}>
                      <MaterialIcons name="child-care" size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>{child.childName}</Text>
                      <Text style={styles.childDetail}>
                        Class of {child.classOf} • {child.yearsToSave} years to save
                      </Text>
                    </View>
                    <View style={styles.childAmount}>
                      <Text style={styles.shareLabel}>Monthly</Text>
                      <Text testID={`child-share-${index}`} style={styles.shareAmount}>
                        {formatCurrency(child.monthlyShare, countryCode)}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}

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
                  Adjusted for a {formatPercentage(countryConfig.inflationRate)} annual increase in education costs.
                </Text>
              </View>
            </View>

            <View style={styles.factorRow}>
              <MaterialIcons name="school" size={18} color={Colors.onSurfaceVariant} />
              <View style={styles.factorText}>
                <Text style={styles.factorLabel}>Annual Cost Basis</Text>
                <Text style={styles.factorDetail}>
                  Based on {formatCurrency(annualCost, countryCode)}/year per child.
                </Text>
              </View>
            </View>
          </View>
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
            title="Start Tracking"
            onPress={handleConfirm}
            icon="check"
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
    ...Typography.screenTitle,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  narrative: {
    ...Typography.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },

  // Hero
  heroCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  heroAmount: {
    ...Typography.stat,
  },
  heroUnit: {
    fontSize: 20,
    fontWeight: '400',
    color: Colors.onSurfaceVariant,
  },
  heroSubtext: {
    ...Typography.muted,
    marginTop: Spacing.sm,
  },

  // Income section
  sectionLabel: {
    ...Typography.label,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.md,
  },
  contextHint: {
    ...Typography.muted,
    fontSize: 13,
    color: Colors.success,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.xs,
  },

  // What-if
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

  // Funding card
  fundingCard: {
    marginTop: Spacing.sm,
  },
  fundingLabel: {
    ...Typography.body,
    fontWeight: '600',
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryContainer,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  fundingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fundingText: {
    ...Typography.body,
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
  },

  // Breakdown
  breakdownSection: {
    marginTop: Spacing.lg,
  },
  childCard: {
    marginBottom: Spacing.sm,
  },
  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  childInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  childName: {
    ...Typography.cardHeading,
    fontSize: 16,
  },
  childDetail: {
    ...Typography.muted,
    fontSize: 12,
    marginTop: 2,
  },
  childAmount: {
    alignItems: 'flex-end',
  },
  shareLabel: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  shareAmount: {
    ...Typography.cardHeading,
    color: Colors.primary,
    marginTop: 2,
  },

  // Factors
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
