import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Layout, Spacing, Radius, Shadows } from '@/constants/theme';
import { Card, Button } from '@/components/ui';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { calculateProjectedCost, calculateDegreeTotal } from '@/services/calculator';
import { COUNTRY_CONFIGS } from '@/constants/countries';
import { formatCurrency } from '@/utils/format';
import type { CountryCode, SchoolResult } from '@/types';

function ForecastCard({
  years,
  cost,
  change,
  highlighted,
  testID,
  countryCode,
}: {
  years: number;
  cost: number;
  change: number;
  highlighted?: boolean;
  testID: string;
  countryCode: CountryCode;
}) {
  return (
    <Card
      variant={highlighted ? 'elevated' : 'outlined'}
      style={[forecastStyles.card, highlighted && forecastStyles.highlighted]}
      testID={testID}
    >
      <Text style={forecastStyles.label}>In {years} Years</Text>
      <Text style={[forecastStyles.cost, highlighted && forecastStyles.costHighlight]}>
        {formatCurrency(cost, countryCode)}
      </Text>
      <Text style={forecastStyles.change}>+{change.toFixed(1)}%</Text>
    </Card>
  );
}

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const schoolResults = useOnboardingStore((s) => s.schoolResults);
  const selectedTier = useOnboardingStore((s) => s.selectedTier);
  const children = useOnboardingStore((s) => s.children);
  const countryCode = useOnboardingStore((s) => s.countryCode);
  const INFLATION_RATE = COUNTRY_CONFIGS[countryCode].inflationRate;
  const countryTiers = COUNTRY_CONFIGS[countryCode].schoolTiers;

  const school: SchoolResult | undefined = useMemo(() => {
    const decodedId = decodeURIComponent(id ?? '');
    const fromResults = schoolResults.find((s) => s.name === decodedId);
    if (fromResults) return fromResults;
    for (const tier of countryTiers) {
      const found = tier.schools.find((s) => s.name === decodedId);
      if (found) return found;
    }
    return undefined;
  }, [id, schoolResults]);

  const annualTuition = school?.annualTuition ?? 55000;
  const schoolName = school?.name ?? decodeURIComponent(id ?? 'Unknown School');

  const forecasts = useMemo(() => {
    return [5, 10, 15].map((years) => {
      const cost = calculateProjectedCost(annualTuition, INFLATION_RATE, years);
      const change = ((cost - annualTuition) / annualTuition) * 100;
      return { years, cost, change };
    });
  }, [annualTuition]);

  const barData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [0, 5, 10, 15, 20].map((offset) => ({
      year: currentYear + offset,
      cost: calculateProjectedCost(annualTuition, INFLATION_RATE, offset),
    }));
  }, [annualTuition]);

  const maxBarCost = Math.max(...barData.map((b) => b.cost));

  // Use oldest child's enrollment year for 4-year total
  const oldestChild = children.length > 0
    ? children.reduce((a, b) => (b.targetAge - b.currentAge > a.targetAge - a.currentAge ? b : a))
    : null;
  const enrollmentYear = oldestChild
    ? new Date().getFullYear() + (oldestChild.targetAge - oldestChild.currentAge)
    : new Date().getFullYear() + 10;

  const universityYears = COUNTRY_CONFIGS[countryCode].universityYears;
  const degreeTotal = calculateDegreeTotal(annualTuition, INFLATION_RATE, enrollmentYear, universityYears);
  const baseDegree = annualTuition * universityYears;
  const inflationImpact = degreeTotal - baseDegree;

  return (
    <SafeAreaView style={styles.safe} testID="school-detail-screen">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
          </Pressable>
          <Text style={styles.headerTitle}>Specific School Projection</Text>
          <Text style={styles.headerLogo}>EduCal</Text>
        </View>

        {/* School Info */}
        <Card style={styles.schoolCard}>
          <View style={styles.schoolRow}>
            <View style={styles.schoolIcon}>
              <MaterialIcons name="school" size={28} color={Colors.primary} />
            </View>
            <View style={styles.schoolInfo}>
              <Text style={styles.schoolName} testID="school-name">{schoolName}</Text>
              <Text style={styles.tuitionLabel}>Current Annual Tuition</Text>
              <Text style={styles.tuitionValue} testID="school-annual-tuition">
                {formatCurrency(annualTuition, countryCode)}
              </Text>
            </View>
          </View>
          <Text style={styles.inflationNote} testID="school-inflation-rate">
            Education inflation rate applied: {(INFLATION_RATE * 100).toFixed(1)}%
          </Text>
        </Card>

        {/* Future Cost Forecast */}
        <Text style={styles.sectionTitle}>Future Cost Forecast</Text>
        <View style={styles.forecastRow}>
          {forecasts.map((f) => (
            <ForecastCard
              key={f.years}
              years={f.years}
              cost={f.cost}
              change={f.change}
              highlighted={f.years === 10}
              testID={`forecast-${f.years}yr`}
              countryCode={countryCode}
            />
          ))}
        </View>

        {/* Tuition Path Chart */}
        <Text style={styles.sectionTitle}>Projected Tuition Path</Text>
        <Card variant="outlined" testID="tuition-path-chart">
          <View style={styles.chartBars}>
            {barData.map((b) => {
              const height = maxBarCost > 0 ? (b.cost / maxBarCost) * 140 : 0;
              const isTarget = b.year === enrollmentYear;
              return (
                <View key={b.year} style={styles.chartBarCol}>
                  <Text style={styles.chartBarValue}>{formatCurrency(b.cost, countryCode)}</Text>
                  <View
                    style={[
                      styles.chartBar,
                      { height: Math.max(height, 4) },
                      isTarget && styles.chartBarHighlight,
                    ]}
                  />
                  <Text style={[styles.chartBarLabel, isTarget && styles.chartBarLabelHighlight]}>
                    {b.year}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* 4-Year Degree Total */}
        <Card style={styles.degreeCard} testID="degree-total-card">
          <Text style={styles.degreeLabel}>{universityYears}-Year Degree Total</Text>
          <Text style={styles.degreeSubLabel}>Projected for Class of {enrollmentYear}</Text>
          <Text style={styles.degreeTotal} testID="degree-total-amount">
            {formatCurrency(degreeTotal, countryCode)}
          </Text>
          <View style={styles.degreeBreakdown}>
            <View style={styles.degreeRow}>
              <Text style={styles.degreeRowLabel}>Base Cost ({universityYears} × {formatCurrency(annualTuition, countryCode)})</Text>
              <Text style={styles.degreeRowValue}>{formatCurrency(baseDegree, countryCode)}</Text>
            </View>
            <View style={styles.degreeRow}>
              <Text style={styles.degreeRowLabel}>Inflation Impact</Text>
              <Text style={[styles.degreeRowValue, { color: Colors.error }]}>
                +{formatCurrency(inflationImpact, countryCode)}
              </Text>
            </View>
          </View>
        </Card>

        {/* CTA */}
        <Button
          title="+ Add to Savings Plan"
          variant="primary"
          onPress={() => router.back()}
          style={styles.ctaButton}
          testID="add-to-plan-button"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const forecastStyles = StyleSheet.create({
  card: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm },
  highlighted: { borderLeftWidth: 3, borderLeftColor: Colors.primary },
  label: { ...Typography.smallStat, marginBottom: Spacing.xs },
  cost: { fontSize: 15, fontWeight: '700', color: Colors.onSurface, marginBottom: 2 },
  costHighlight: { color: Colors.primary },
  change: { ...Typography.smallStat, color: Colors.success },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Layout.screenPaddingBottom,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  backBtn: { marginRight: Spacing.md },
  headerTitle: { ...Typography.body, fontWeight: '600', flex: 1 },
  headerLogo: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  schoolCard: { marginBottom: Spacing.lg },
  schoolRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  schoolIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  schoolInfo: { flex: 1 },
  schoolName: { ...Typography.cardHeading, marginBottom: 4 },
  tuitionLabel: { ...Typography.smallStat, marginBottom: 2 },
  tuitionValue: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  inflationNote: { ...Typography.muted, fontSize: 13, fontStyle: 'italic' },
  sectionTitle: { ...Typography.heading, marginBottom: Spacing.md },
  forecastRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    minHeight: 180,
  },
  chartBarCol: { alignItems: 'center', flex: 1 },
  chartBarValue: { ...Typography.smallStat, fontSize: 10, marginBottom: 4 },
  chartBar: { width: 28, backgroundColor: Colors.chartSecondary, borderRadius: 4 },
  chartBarHighlight: { backgroundColor: Colors.primary },
  chartBarLabel: { ...Typography.smallStat, marginTop: 4 },
  chartBarLabelHighlight: { color: Colors.primary, fontWeight: '700' },
  degreeCard: {
    backgroundColor: Colors.primaryDark,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  degreeLabel: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  degreeSubLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: Spacing.md },
  degreeTotal: { color: '#FFFFFF', fontSize: 36, fontWeight: '800', marginBottom: Spacing.md },
  degreeBreakdown: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: Spacing.md,
  },
  degreeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  degreeRowLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  degreeRowValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  ctaButton: { marginBottom: Spacing.lg },
});
