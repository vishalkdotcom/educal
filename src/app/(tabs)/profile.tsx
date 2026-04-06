import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Layout, Spacing, Radius } from '@/constants/theme';
import { Card, Button } from '@/components/ui';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { useTotalSaved } from '@/stores/useDashboardStore';
import { COUNTRY_CONFIGS } from '@/constants/countries';
import { formatCurrency, formatAge } from '@/utils/format';
import type { CountryCode } from '@/types';

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={rowStyles.row}>
      <View style={rowStyles.iconWrap}>
        <MaterialIcons name={icon} size={18} color={Colors.primary} />
      </View>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.value}>{value}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const children = useOnboardingStore((s) => s.children);
  const monthlyIncome = useOnboardingStore((s) => s.monthlyIncome);
  const currentSavings = useOnboardingStore((s) => s.currentSavings);
  const location = useOnboardingStore((s) => s.location);
  const selectedTier = useOnboardingStore((s) => s.selectedTier);
  const countryCode = useOnboardingStore((s) => s.countryCode);
  const setCountryCode = useOnboardingStore((s) => s.setCountryCode);
  const reset = useOnboardingStore((s) => s.reset);
  const totalSaved = useTotalSaved();

  const setSelectedTier = useOnboardingStore((s) => s.setSelectedTier);
  const setCustomAnnualCost = useOnboardingStore((s) => s.setCustomAnnualCost);
  const setSavingsResult = useOnboardingStore((s) => s.setSavingsResult);

  const handleCountryChange = (code: CountryCode) => {
    if (code === countryCode) return;
    Alert.alert(
      'Change Country',
      `Switch to ${COUNTRY_CONFIGS[code].name}? Your savings plan will be reset and you'll need to reconfigure costs and goals.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: () => {
            setCountryCode(code);
            setCustomAnnualCost(null, 'user');
            setSavingsResult(null);
            router.push('/onboarding/step2');
          },
        },
      ],
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will clear all your data and restart the onboarding process. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            reset();
            router.replace('/onboarding/step1');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} testID="profile-screen">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>EduCal</Text>
        </View>

        <Text style={styles.title}>Profile & Settings</Text>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <MaterialIcons name="person" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.familyLabel}>
            {children.length > 0
              ? `${children.map((c) => c.name).join(' & ')}'s Family`
              : 'Your Family'}
          </Text>
        </View>

        {/* Children */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children</Text>
          {children.length === 0 ? (
            <Card variant="outlined">
              <Text style={styles.emptyText}>No children added yet</Text>
            </Card>
          ) : (
            children.map((child) => (
              <Card key={child.id} variant="outlined" style={styles.childCard}>
                <View style={styles.childRow}>
                  <View style={styles.childAvatar}>
                    <MaterialIcons name="face" size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{child.name}</Text>
                    <Text style={styles.childMeta}>
                      {formatAge(child.currentAge)} • Target: {child.targetLevel.replace('_', ' ')}
                    </Text>
                  </View>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>ACTIVE</Text>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Financial Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Details</Text>
          <Card variant="outlined">
            <View style={rowStyles.row}>
              <View style={rowStyles.iconWrap}>
                <MaterialIcons name="public" size={18} color={Colors.primary} />
              </View>
              <Text style={rowStyles.label}>Country</Text>
              <View style={countryStyles.options}>
                {(Object.keys(COUNTRY_CONFIGS) as CountryCode[]).map((code) => (
                  <Pressable
                    key={code}
                    testID={`country-option-${code}`}
                    onPress={() => handleCountryChange(code)}
                    style={[
                      countryStyles.pill,
                      code === countryCode && countryStyles.pillActive,
                    ]}
                  >
                    <Text
                      style={[
                        countryStyles.pillText,
                        code === countryCode && countryStyles.pillTextActive,
                      ]}
                    >
                      {COUNTRY_CONFIGS[code].name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <InfoRow icon="attach-money" label="Monthly Income" value={formatCurrency(monthlyIncome, countryCode)} />
            <InfoRow icon="savings" label="Current Savings" value={formatCurrency(currentSavings, countryCode)} />
            <InfoRow icon="account-balance-wallet" label="Total Saved" value={formatCurrency(totalSaved, countryCode)} />
            <InfoRow icon="location-on" label="Location" value={location?.name ?? 'Not set'} />
            <InfoRow
              icon="school"
              label="Education Tier"
              value={selectedTier ? selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1) : 'Not selected'}
            />
          </Card>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Button
            title="Edit Plan"
            variant="outlined"
            icon="edit"
            onPress={() => router.push('/onboarding/step1')}
            style={styles.button}
          />
          <Button
            title="Reset Onboarding"
            variant="text"
            icon="refresh"
            onPress={handleReset}
            style={styles.button}
            textStyle={{ color: Colors.error }}
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>EduCal v1.0.0</Text>
          <Text style={styles.appInfoText}>Built for hackathon April 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  label: { ...Typography.body, flex: 1 },
  value: { fontSize: 15, fontWeight: '600', color: Colors.onSurface },
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
  title: { ...Typography.screenTitle, marginBottom: Spacing.lg },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  familyLabel: { ...Typography.heading, textAlign: 'center' },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { ...Typography.heading, fontSize: 18, marginBottom: Spacing.md },
  emptyText: { ...Typography.muted, textAlign: 'center' },
  childCard: { marginBottom: Spacing.sm },
  childRow: { flexDirection: 'row', alignItems: 'center' },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  childInfo: { flex: 1 },
  childName: { ...Typography.body, fontWeight: '600' },
  childMeta: { ...Typography.muted, fontSize: 13, textTransform: 'capitalize' },
  activeBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.success, letterSpacing: 1 },
  button: { marginBottom: Spacing.sm },
  appInfo: { alignItems: 'center', paddingVertical: Spacing.xl },
  appInfoText: { ...Typography.muted, fontSize: 12 },
});

const countryStyles = StyleSheet.create({
  options: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.outlineLight,
    backgroundColor: Colors.surface,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: { fontSize: 12, fontWeight: '500', color: Colors.onSurfaceVariant },
  pillTextActive: { color: '#FFFFFF' },
});
