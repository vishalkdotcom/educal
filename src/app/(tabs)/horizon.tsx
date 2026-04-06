import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Layout, Spacing, Radius, Shadows } from '@/constants/theme';
import { Card, Button, ProgressBar, Input } from '@/components/ui';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import {
  useMonthlyGoal,
  usePerChildProgress,
  useTotalSaved,
  useSavingsProgress,
} from '@/stores/useDashboardStore';
import { formatCurrency } from '@/utils/format';

export default function HorizonScreen() {
  const router = useRouter();
  const monthlyGoal = useMonthlyGoal();
  const childProgress = usePerChildProgress();
  const totalSaved = useTotalSaved();
  const savingsProgress = useSavingsProgress();
  const savingsResult = useOnboardingStore((s) => s.savingsResult);
  const children = useOnboardingStore((s) => s.children);
  const savingsLog = useOnboardingStore((s) => s.savingsLog);
  const addSavingsEntry = useOnboardingStore((s) => s.addSavingsEntry);
  const removeSavingsEntry = useOnboardingStore((s) => s.removeSavingsEntry);
  const countryCode = useOnboardingStore((s) => s.countryCode);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [entryAmount, setEntryAmount] = useState('');
  const [entryNote, setEntryNote] = useState('');

  const currencySymbol =
    countryCode === 'US' ? '$' : countryCode === 'IN' ? '₹' : 'Rp';

  const handleLogSavings = () => {
    const amount = Number(entryAmount);
    if (amount <= 0) return;

    addSavingsEntry({
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString().slice(0, 10),
      note: entryNote.trim() || undefined,
    });

    setEntryAmount('');
    setEntryNote('');
    setModalVisible(false);
  };

  const handleDeleteEntry = (id: string) => {
    Alert.alert('Remove Entry', 'Remove this savings entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeSavingsEntry(id) },
    ]);
  };

  const recentEntries = savingsLog.slice(0, 5);

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
          <MaterialIcons
            name="notifications-none"
            size={24}
            color={Colors.onSurfaceVariant}
          />
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
          <Text style={styles.goalAmount}>
            {formatCurrency(monthlyGoal, countryCode)}
          </Text>
          <Text style={styles.goalMeta}>
            {savingsResult
              ? `Target reached by ${savingsResult.targetYear}`
              : 'No plan calculated yet'}
          </Text>
          {savingsResult && (
            <View style={styles.goalStats}>
              <View style={styles.goalStat}>
                <Text style={styles.statValue}>
                  {formatCurrency(savingsResult.projectedTotal, countryCode)}
                </Text>
                <Text style={styles.statLabel}>Total Cost</Text>
              </View>
              <View style={styles.goalDivider} />
              <View style={styles.goalStat}>
                <Text style={styles.statValue}>
                  {Math.round(savingsResult.currentFunded)}%
                </Text>
                <Text style={styles.statLabel}>Funded</Text>
              </View>
              <View style={styles.goalDivider} />
              <View style={styles.goalStat}>
                <Text style={styles.statValue}>
                  {formatCurrency(totalSaved, countryCode)}
                </Text>
                <Text style={styles.statLabel}>Saved</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Savings Progress Summary */}
        {savingsLog.length > 0 && (
          <Card
            testID="savings-progress-card"
            variant="filled"
            style={styles.progressCard}
          >
            <View style={styles.progressHeader}>
              <MaterialIcons name="savings" size={20} color={Colors.primaryDark} />
              <Text style={styles.progressTitle}>Savings Progress</Text>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatValue}>
                  {formatCurrency(totalSaved, countryCode)}
                </Text>
                <Text style={styles.progressStatLabel}>Total Saved</Text>
              </View>
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatValue}>
                  {formatCurrency(savingsProgress.monthlyAverage, countryCode)}
                </Text>
                <Text style={styles.progressStatLabel}>Monthly Avg</Text>
              </View>
              <View style={styles.progressStatItem}>
                <View style={styles.statusBadge}>
                  <MaterialIcons
                    name={savingsProgress.onTrack ? 'check-circle' : 'warning'}
                    size={14}
                    color={savingsProgress.onTrack ? Colors.success : Colors.warning}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: savingsProgress.onTrack
                          ? Colors.success
                          : Colors.warning,
                      },
                    ]}
                  >
                    {savingsProgress.onTrack ? 'On Track' : 'Behind'}
                  </Text>
                </View>
                <Text style={styles.progressStatLabel}>Status</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Log Savings Button */}
        <Button
          testID="log-savings-button"
          title="Log Savings"
          variant="primary"
          icon="add"
          onPress={() => setModalVisible(true)}
          style={styles.logButton}
        />

        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            {recentEntries.map((entry) => (
              <Pressable
                key={entry.id}
                testID={`savings-entry-${entry.id}`}
                onLongPress={() => handleDeleteEntry(entry.id)}
                style={styles.entryRow}
              >
                <View style={styles.entryIcon}>
                  <MaterialIcons
                    name="account-balance-wallet"
                    size={18}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryAmount}>
                    {formatCurrency(entry.amount, countryCode)}
                  </Text>
                  {entry.note && (
                    <Text style={styles.entryNote} numberOfLines={1}>
                      {entry.note}
                    </Text>
                  )}
                </View>
                <Text style={styles.entryDate}>{entry.date}</Text>
              </Pressable>
            ))}
            {savingsLog.length > 5 && (
              <Text style={styles.moreEntries}>
                + {savingsLog.length - 5} more entries
              </Text>
            )}
          </View>
        )}

        {/* Per-Child Progress */}
        {childProgress.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Per-Child Progress</Text>
            {childProgress.map((child, index) => {
              const breakdown = savingsResult?.perChild.find(
                (c) => c.childId === child.childId,
              );
              return (
                <Card
                  key={child.childId}
                  variant="outlined"
                  style={styles.childCard}
                  testID={`horizon-child-${index}`}
                >
                  <View style={styles.childHeader}>
                    <View style={styles.childAvatar}>
                      <MaterialIcons
                        name="face"
                        size={24}
                        color={Colors.primary}
                      />
                    </View>
                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>{child.childName}</Text>
                      {breakdown && (
                        <Text style={styles.childMeta}>
                          {breakdown.yearsToSave} years to save •{' '}
                          {formatCurrency(breakdown.monthlyShare, countryCode)}/mo
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

      {/* Log Savings Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Savings</Text>
              <Pressable
                testID="modal-close"
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color={Colors.onSurfaceVariant}
                />
              </Pressable>
            </View>

            <Input
              testID="savings-amount-input"
              label="AMOUNT"
              prefix={currencySymbol}
              value={entryAmount}
              onChangeText={(text) => setEntryAmount(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="Enter amount saved"
              containerStyle={{ marginBottom: Spacing.md }}
            />

            <Input
              testID="savings-note-input"
              label="NOTE (OPTIONAL)"
              value={entryNote}
              onChangeText={setEntryNote}
              placeholder="e.g. Monthly contribution"
              containerStyle={{ marginBottom: Spacing.xl }}
            />

            <Button
              testID="savings-submit-button"
              title="Save Entry"
              onPress={handleLogSavings}
              disabled={!entryAmount || Number(entryAmount) <= 0}
              icon="check"
              iconPosition="right"
            />
          </View>
        </View>
      </Modal>
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
  progressCard: {
    marginBottom: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  progressTitle: {
    ...Typography.cardHeading,
    color: Colors.primaryDark,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressStatValue: {
    ...Typography.cardHeading,
    fontSize: 15,
    color: Colors.primaryDark,
  },
  progressStatLabel: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    ...Typography.cardHeading,
    fontSize: 14,
  },
  logButton: {
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading,
    marginBottom: Spacing.md,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceWhite,
    borderRadius: Radius.default,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.outlineLight,
  },
  entryIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  entryInfo: {
    flex: 1,
  },
  entryAmount: {
    ...Typography.body,
    fontWeight: '600',
    fontSize: 15,
  },
  entryNote: {
    ...Typography.muted,
    fontSize: 12,
    marginTop: 2,
  },
  entryDate: {
    ...Typography.label,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  moreEntries: {
    ...Typography.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: Spacing.xs,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surfaceWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.xl,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    ...Typography.screenTitle,
    fontSize: 20,
  },
});
