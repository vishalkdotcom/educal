import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Layout, Spacing, Radius, Shadows } from '@/constants/theme';
import { Card, ProgressBar } from '@/components/ui';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import type { CountryCode } from '@/types';
import {
  useWealthReport,
  useGrowthProjection,
  useFundingSources,
  useTotalSaved,
  useSavingsProgress,
} from '@/stores/useDashboardStore';
import { formatCurrency, formatCurrencyCompact } from '@/utils/format';

function GrowthChart({ milestones, countryCode }: { milestones: { year: number; amount: number }[]; countryCode: CountryCode }) {
  if (milestones.length < 2) return null;
  const maxAmount = Math.max(...milestones.map((m) => m.amount));

  return (
    <View style={chartStyles.container} testID="growth-chart">
      <View style={chartStyles.bars}>
        {milestones.map((m, i) => {
          const height = maxAmount > 0 ? (m.amount / maxAmount) * 120 : 0;
          return (
            <View key={m.year} style={chartStyles.barCol}>
              <Text style={chartStyles.barValue}>{formatCurrencyCompact(m.amount, countryCode)}</Text>
              <View style={[chartStyles.bar, { height: Math.max(height, 4) }]} />
              <Text style={chartStyles.barLabel}>{m.year}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function FundingRow({
  label,
  amount,
  icon,
  index,
  countryCode,
}: {
  label: string;
  amount: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  index: number;
  countryCode: CountryCode;
}) {
  return (
    <View style={fundStyles.row} testID={`funding-source-${index}`}>
      <View style={fundStyles.iconWrap}>
        <MaterialIcons name={icon} size={20} color={Colors.primary} />
      </View>
      <Text style={fundStyles.label}>{label}</Text>
      <Text style={fundStyles.amount}>{formatCurrency(amount, countryCode)}</Text>
    </View>
  );
}

export default function InsightsScreen() {
  const report = useWealthReport();
  const children = useOnboardingStore((s) => s.children);
  const countryCode = useOnboardingStore((s) => s.countryCode);
  const projections = useGrowthProjection();
  const fundingSources = useFundingSources();

  const totalSaved = useTotalSaved();
  const savingsProgress = useSavingsProgress();

  const childNames = children.map((c) => c.name).join(' & ');
  const fundedPercent = report
    ? Math.round(
        report.childGoals.reduce((s, c) => s + c.progressPercent, 0) / Math.max(report.childGoals.length, 1),
      )
    : 0;

  return (
    <SafeAreaView style={styles.safe} testID="insights-screen">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>EduCal</Text>
          <MaterialIcons name="notifications-none" size={24} color={Colors.onSurfaceVariant} />
        </View>

        <Text style={styles.label}>YOUR PROGRESS</Text>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.narrative}>
          {report
            ? `Your horizon is clearing. Based on current contributions and projected growth, you are on track to fund ${fundedPercent}% of total estimated education costs for ${childNames}.`
            : 'Complete onboarding to see your wealth report.'}
        </Text>

        {/* Growth Projection */}
        {report && (
          <Card style={styles.growthCard} testID="growth-projection-card">
            <View style={styles.growthHeader}>
              <Text style={styles.growthLabel}>Growth Projection</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>PROJECTED TOTAL</Text>
              </View>
            </View>
            <Text style={styles.growthAmount} testID="growth-projection-amount">
              {formatCurrency(report.growthProjection.projectedTotal, countryCode)}
            </Text>
            <View style={styles.targetPill}>
              <MaterialIcons name="flag" size={14} color={Colors.primary} />
              <Text style={styles.targetText}>Target: {report.growthProjection.targetYear}</Text>
            </View>
            <GrowthChart milestones={projections} countryCode={countryCode} />
          </Card>
        )}


        {/* Savings Progress */}
        {report && totalSaved > 0 && (
          <Card style={styles.savingsCard} testID="savings-progress-card">
            <View style={styles.savingsHeader}>
              <MaterialIcons name="savings" size={20} color={Colors.success} />
              <Text style={styles.savingsTitle}>Savings Progress</Text>
            </View>
            <View style={styles.savingsRow}>
              <View style={styles.savingsStat}>
                <Text style={styles.savingsStatValue}>{formatCurrency(totalSaved, countryCode)}</Text>
                <Text style={styles.savingsStatLabel}>Total Saved</Text>
              </View>
              <View style={styles.savingsStat}>
                <Text style={styles.savingsStatValue}>
                  {formatCurrency(savingsProgress.monthlyAverage, countryCode)}
                </Text>
                <Text style={styles.savingsStatLabel}>Monthly Avg</Text>
              </View>
              <View style={styles.savingsStat}>
                <Text style={[styles.savingsStatValue, { color: savingsProgress.onTrack ? Colors.success : Colors.warning }]}>
                  {savingsProgress.onTrack ? 'On Track' : 'Behind'}
                </Text>
                <Text style={styles.savingsStatLabel}>Status</Text>
              </View>
            </View>
            <ProgressBar
              progress={Math.min(totalSaved / (report.growthProjection.projectedTotal || 1), 1)}
              label={`${Math.round((totalSaved / (report.growthProjection.projectedTotal || 1)) * 100)}% of projected goal`}
              testID="savings-overall-progress"
            />
          </Card>
        )}

        {/* Funding Sources */}
        {report && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Funding Sources</Text>
            <Card variant="outlined">
              <FundingRow label="Personal Savings" amount={fundingSources.personalSavings} icon="savings" index={0} countryCode={countryCode} />
              <FundingRow label="Investment Growth" amount={fundingSources.marketGrowth} icon="show-chart" index={1} countryCode={countryCode} />
              <FundingRow label="Potential Scholarships" amount={fundingSources.potentialGrants} icon="card-giftcard" index={2} countryCode={countryCode} />
            </Card>
          </View>
        )}

        {/* Child-by-Child Progress */}
        {report && report.childGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Child-by-Child Progress</Text>
            {report.childGoals.map((goal, index) => (
              <Card
                key={goal.childId}
                variant="outlined"
                style={styles.childGoalCard}
                testID={`child-goal-${index}`}
              >
                <View style={styles.childGoalHeader}>
                  <Text style={styles.childGoalName}>{goal.childName}</Text>
                  <View style={styles.classBadge}>
                    <Text style={styles.classBadgeText}>CLASS OF {goal.classOf}</Text>
                  </View>
                </View>
                <Text style={styles.childCostLabel}>EST. FUTURE COST (ADJUSTED)</Text>
                <Text style={styles.childCostValue}>{formatCurrency(goal.adjustedCost, countryCode)}</Text>
                <ProgressBar
                  progress={Math.min(goal.progressPercent / 100, 1)}
                  showPercent
                  testID={`child-goal-progress-${index}`}
                />
              </Card>
            ))}
          </View>
        )}

        {/* Strategic Milestones */}
        {report && (
          <View style={styles.section} testID="milestones-section">
            <Text style={styles.sectionTitle}>Your Milestones</Text>
            <Card variant="outlined">
              {report.milestones.map((ms, i) => (
                <View
                  key={ms.title}
                  style={[styles.milestoneRow, i < report.milestones.length - 1 && styles.milestoneBorder]}
                >
                  <MaterialIcons
                    name={
                      ms.status === 'completed'
                        ? 'check-circle'
                        : ms.status === 'upcoming'
                          ? 'schedule'
                          : 'radio-button-unchecked'
                    }
                    size={20}
                    color={ms.status === 'completed' ? Colors.success : Colors.onSurfaceVariant}
                  />
                  <View style={styles.milestoneInfo}>
                    <Text style={styles.milestoneTitle}>{ms.title}</Text>
                    <Text style={styles.milestoneSub}>{ms.description}</Text>
                  </View>
                </View>
              ))}
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const chartStyles = StyleSheet.create({
  container: { marginTop: Spacing.md },
  bars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  barCol: { alignItems: 'center', flex: 1 },
  barValue: { ...Typography.smallStat, marginBottom: 4, fontSize: 11 },
  bar: { width: 28, backgroundColor: Colors.primary, borderRadius: 4 },
  barLabel: { ...Typography.smallStat, marginTop: 4 },
});

const fundStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  label: { ...Typography.body, flex: 1 },
  amount: { fontSize: 16, fontWeight: '700', color: Colors.onSurface },
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logo: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  label: { ...Typography.label, marginBottom: Spacing.xs },
  title: { ...Typography.screenTitle, marginBottom: Spacing.sm },
  narrative: { ...Typography.body, color: Colors.onSurfaceVariant, marginBottom: Spacing.lg, lineHeight: 24 },
  growthCard: { marginBottom: Spacing.lg },
  savingsCard: { marginBottom: Spacing.lg, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: Radius.default },
  savingsHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  savingsTitle: { ...Typography.cardHeading, color: Colors.success },
  savingsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  savingsStat: { alignItems: 'center', flex: 1 },
  savingsStatValue: { fontSize: 15, fontWeight: '700', color: Colors.onSurface, marginBottom: 2 },
  savingsStatLabel: { ...Typography.smallStat, fontSize: 10, color: Colors.onSurfaceVariant },
  growthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  growthLabel: { ...Typography.cardHeading },
  badge: { backgroundColor: Colors.primaryContainer, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: 4 },
  badgeText: { ...Typography.smallStat, color: Colors.primary, fontSize: 10 },
  growthAmount: { ...Typography.stat, fontSize: 36, marginBottom: Spacing.xs },
  targetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  targetText: { ...Typography.smallStat, color: Colors.primary, fontSize: 12 },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { ...Typography.heading, marginBottom: Spacing.md },
  childGoalCard: { marginBottom: Spacing.sm },
  childGoalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  childGoalName: { ...Typography.cardHeading },
  classBadge: { backgroundColor: Colors.primaryContainer, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: 4 },
  classBadgeText: { ...Typography.smallStat, color: Colors.primary, fontSize: 10 },
  childCostLabel: { ...Typography.smallStat, marginBottom: 2 },
  childCostValue: { fontSize: 20, fontWeight: '700', color: Colors.onSurface, marginBottom: Spacing.md },
  milestoneRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.md },
  milestoneBorder: { borderBottomWidth: 1, borderBottomColor: Colors.outlineLight },
  milestoneInfo: { flex: 1 },
  milestoneTitle: { ...Typography.body, fontWeight: '600' },
  milestoneSub: { ...Typography.muted, fontSize: 13 },
});
