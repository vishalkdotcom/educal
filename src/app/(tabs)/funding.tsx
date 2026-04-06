import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Layout, Spacing, Radius, Shadows } from '@/constants/theme';
import { Card } from '@/components/ui';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { SCHOOL_TIERS } from '@/constants/schools';
import { formatCurrency } from '@/utils/format';
import type { SchoolResult } from '@/types';

const TIER_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  public: { label: 'PUBLIC', color: Colors.success, bg: '#ECFDF5' },
  private: { label: 'PRIVATE', color: '#7C3AED', bg: '#F5F3FF' },
  international: { label: 'INTERNATIONAL', color: Colors.primary, bg: Colors.primaryContainer },
};

function SchoolCard({
  school,
  index,
  onPress,
}: {
  school: SchoolResult;
  index: number;
  onPress: () => void;
}) {
  const badge = TIER_BADGES[school.type] ?? TIER_BADGES.public;
  return (
    <Pressable onPress={onPress} testID={`school-card-${index}`}>
      <Card variant="outlined" style={cardStyles.card}>
        <View style={cardStyles.row}>
          <View style={cardStyles.iconWrap}>
            <MaterialIcons
              name={school.type === 'international' ? 'public' : school.type === 'private' ? 'school' : 'account-balance'}
              size={24}
              color={Colors.primary}
            />
          </View>
          <View style={cardStyles.info}>
            <Text style={cardStyles.name}>{school.name}</Text>
            <View style={[cardStyles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[cardStyles.badgeText, { color: badge.color }]}>{badge.label}</Text>
            </View>
          </View>
          <View style={cardStyles.costCol}>
            <Text style={cardStyles.costLabel}>Annual</Text>
            <Text style={cardStyles.cost}>{formatCurrency(school.annualTuition)}</Text>
          </View>
        </View>
        <View style={cardStyles.footer}>
          <Text style={cardStyles.footerText}>View Projection</Text>
          <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
        </View>
      </Card>
    </Pressable>
  );
}

export default function FundingScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const schoolResults = useOnboardingStore((s) => s.schoolResults);
  const selectedTier = useOnboardingStore((s) => s.selectedTier);

  const allSchools = useMemo(() => {
    if (schoolResults.length > 0) return schoolResults;
    // Fallback: show schools from selected tier or all tiers
    if (selectedTier) {
      const tier = SCHOOL_TIERS.find((t) => t.id === selectedTier);
      return tier?.schools ?? [];
    }
    return SCHOOL_TIERS.flatMap((t) => t.schools);
  }, [schoolResults, selectedTier]);

  const filtered = useMemo(() => {
    if (!search.trim()) return allSchools;
    const q = search.toLowerCase();
    return allSchools.filter((s) => s.name.toLowerCase().includes(q));
  }, [allSchools, search]);

  return (
    <SafeAreaView style={styles.safe} testID="funding-screen">
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

        <Text style={styles.title}>School Search</Text>
        <Text style={styles.subtitle}>Browse schools and view cost projections</Text>

        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <MaterialIcons name="search" size={20} color={Colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            testID="school-search-input"
            style={styles.searchInput}
            placeholder="Search for a school..."
            placeholderTextColor={Colors.onSurfaceVariant}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <MaterialIcons name="close" size={20} color={Colors.onSurfaceVariant} />
            </Pressable>
          )}
        </View>

        {/* Results */}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="search-off" size={48} color={Colors.outlineLight} />
            <Text style={styles.emptyText}>No schools found</Text>
          </View>
        ) : (
          filtered.map((school, index) => (
            <SchoolCard
              key={`${school.name}-${index}`}
              school={school}
              index={index}
              onPress={() => router.push(`/school/${encodeURIComponent(school.name)}`)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const cardStyles = StyleSheet.create({
  card: { marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: { flex: 1 },
  name: { ...Typography.body, fontWeight: '600', marginBottom: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  costCol: { alignItems: 'flex-end' },
  costLabel: { ...Typography.smallStat, marginBottom: 2 },
  cost: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineLight,
    gap: 4,
  },
  footerText: { ...Typography.label, fontSize: 12 },
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
  title: { ...Typography.screenTitle, marginBottom: Spacing.xs },
  subtitle: { ...Typography.muted, marginBottom: Spacing.lg },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceWhite,
    borderRadius: Radius.default,
    borderWidth: 1,
    borderColor: Colors.outlineLight,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    height: 48,
  },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    ...Typography.input,
    height: 48,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: { ...Typography.muted, marginTop: Spacing.md },
});
