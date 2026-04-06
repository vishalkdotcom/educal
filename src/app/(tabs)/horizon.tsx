import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Layout, Spacing, Radius, Shadows } from '@/constants/theme';
import { Card, Button, ProgressBar } from '@/components/ui';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { useMonthlyGoal, usePerChildProgress } from '@/stores/useDashboardStore';
import { formatCurrency } from '@/utils/format';

export default function HorizonScreen() {
  const router = useRouter();
  const monthlyGoal = useMonthlyGoal();
  const childProgress = usePerChildProgress();
  const savingsResult = useOnboardingStore((s) => s.savingsResult);
  const children = useOnboardingStore((s) => s.children);
  const selectedTier = useOnboardingStore((s) => s.selectedTier);

  return (
    <SafeAreaView style={styles.safe} testID="horizon-screen">
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

        <Text style={styles.title}>Your Education Plan</Text>
        <Text style={styles.subtitle}>
          {children.length > 0
            ? `Tracking savings for ${children.map((c) => c.name).join(' & ')}`
            : 'Complete onboarding to see your plan'}
        </Text>

        {/* Monthly Goal Card */}
        <Card style={styles.goalCard} testID="horizon-goal-card">
          <View style={styles.goalHeader}>
            <MaterialIcons name="trending-up" size={20} color={Colors.primary} />
            <Text style={styles.goalLabel}>MONTHLY SAVINGS GOAL</Text>
          </View>
          <Text style={styles.goalAmount}>{formatCurrency(monthlyGoal)}</Text>
          <Text style={styles.goalMeta}>
            {savingsResult
              ? `Target reached by ${savingsResult.targetYear}`
              : 'No plan calculated yet'}
          </Text>
          {savingsResult && (
            <View style={styles.goalStats}>
              <View style={styles.goalStat}>
                <Text style={styles.statValue}>{formatCurrency(savingsResult.projectedTotal)}</Text>
                <Text style={styles.statLabel}>Total Cost</Text>
              </View>
              <View style={styles.goalDivider} />
              <View style={styles.goalStat}>
                <Text style={styles.statValue}>{Math.round(savingsResult.currentFunded)}%</Text>
                <Text style={styles.statLabel}>Funded</Text>
              </View>
              <View style={styles.goalDivider} />
              <View style={styles.goalStat}>
                <Text style={styles.statValue}>{selectedTier ?? '—'}</Text>
                <Text style={styles.statLabel}>Tier</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Per-Child Progress */}
        {childProgress.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Per-Child Progress</Text>
            {childProgress.map((child, index) => {
              const breakdown = savingsResult?.perChild.find((c) => c.childId === child.childId);
              return (
                <Card
                  key={child.childId}
                  variant="outlined"
                  style={styles.childCard}
                  testID={`horizon-child-${index}`}
                >
                  <View style={styles.childHeader}>
                    <View style={styles.childAvatar}>
                      <MaterialIcons name="face" size={24} color={Colors.primary} />
                    </View>
                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>{child.childName}</Text>
                      {breakdown && (
                        <Text style={styles.childMeta}>
                          {breakdown.yearsToSave} years to save • {formatCurrency(breakdown.monthlyShare)}/mo
                        </Text>
                      )}
                    </View>
                  </View>
                  <ProgressBar
                    progress={Math.min(child.percent / 100, 1)}
                    label={`Class of ${breakdown?.classOf ?? '—'}`}
                    showPercent
                  />
                </Card>
              );
            })}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actions}>
          <Button
            title="Update Plan"
            variant="outlined"
            icon="edit"
            onPress={() => router.push('/onboarding/step1')}
            style={styles.actionButton}
            testID="horizon-update-plan"
          />
          <Button
            title="View Report"
            variant="primary"
            icon="analytics"
            iconPosition="right"
            onPress={() => router.push('/(tabs)/insights')}
            style={styles.actionButton}
            testID="horizon-view-report"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  title: {
    ...Typography.screenTitle,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.muted,
    marginBottom: Spacing.lg,
  },
  goalCard: {
    marginBottom: Spacing.lg,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  goalLabel: {
    ...Typography.label,
  },
  goalAmount: {
    ...Typography.stat,
    marginBottom: Spacing.xs,
  },
  goalMeta: {
    ...Typography.muted,
    marginBottom: Spacing.md,
  },
  goalStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineLight,
  },
  goalStat: {
    flex: 1,
    alignItems: 'center',
  },
  goalDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.outlineLight,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  statLabel: {
    ...Typography.smallStat,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading,
    marginBottom: Spacing.md,
  },
  childCard: {
    marginBottom: Spacing.sm,
  },
  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    ...Typography.cardHeading,
  },
  childMeta: {
    ...Typography.muted,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
