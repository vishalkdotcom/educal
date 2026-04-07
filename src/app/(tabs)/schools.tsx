import { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Layout, Spacing, Radius, Shadows } from '@/constants/theme';
import { Card } from '@/components/ui';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { LocationCard } from '@/components/LocationCard';
import { COUNTRY_CONFIGS } from '@/constants/countries';
import { useSchoolSearch } from '@/hooks/useSchoolSearch';
import { formatCurrency } from '@/utils/format';
import type { CountryCode, SchoolResult, SchoolTierId } from '@/types';

const TIER_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  public: { label: 'PUBLIC', color: Colors.success, bg: '#ECFDF5' },
  private: { label: 'PRIVATE', color: '#7C3AED', bg: '#F5F3FF' },
  international: { label: 'INTERNATIONAL', color: Colors.primary, bg: Colors.primaryContainer },
};

function SchoolCard({
  school,
  index,
  onPress,
  countryCode,
}: {
  school: SchoolResult;
  index: number;
  onPress: () => void;
  countryCode: CountryCode;
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
            <Text style={cardStyles.cost}>{formatCurrency(school.annualTuition, countryCode)}</Text>
          </View>
        </View>
        <View style={cardStyles.footer}>
          <Text style={cardStyles.footerText}>See details</Text>
          <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
        </View>
      </Card>
    </Pressable>
  );
}

function formatTimeAgo(timestamp: number): string {
  const mins = Math.round((Date.now() - timestamp) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  return `${hrs}h ago`;
}

export default function SchoolsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<SchoolTierId | null>(null);
  const schoolResults = useOnboardingStore((s) => s.schoolResults);
  const setSchoolResults = useOnboardingStore((s) => s.setSchoolResults);
  const selectedTier = useOnboardingStore((s) => s.selectedTier);
  const countryCode = useOnboardingStore((s) => s.countryCode);
  const location = useOnboardingStore((s) => s.location);
  const setLocation = useOnboardingStore((s) => s.setLocation);
  const setSearchStatus = useOnboardingStore((s) => s.setSearchStatus);
  const setLastSearchLocation = useOnboardingStore((s) => s.setLastSearchLocation);
  const countryConfig = COUNTRY_CONFIGS[countryCode];
  const countryTiers = countryConfig.schoolTiers;

  const { search: searchSchools, searchStatus, hasGeminiResults, lastSearchTimestamp } = useSchoolSearch();
  const searching = searchStatus === 'searching';

  // Search once on mount — hook handles dedup
  useEffect(() => { searchSchools(); }, []);

  const allSchools = useMemo(() => {
    if (schoolResults.length > 0) return schoolResults;
    if (selectedTier) {
      const tier = countryTiers.find((t) => t.id === selectedTier);
      return tier?.schools ?? [];
    }
    return countryTiers.flatMap((t) => t.schools);
  }, [schoolResults, selectedTier, countryCode]);

  const filtered = useMemo(() => {
    let list = allSchools;
    if (tierFilter) {
      list = list.filter((s) => s.type === tierFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    return list;
  }, [allSchools, search, tierFilter]);

  const handleChangeLocation = () => {
    setLocation(null);
    setSchoolResults([]);
    setSearchStatus('idle');
    setLastSearchLocation(null);
  };

  const subtitle = searching
    ? `Searching near ${location?.name ?? 'your area'}...`
    : hasGeminiResults
      ? `Schools near ${location?.name ?? 'your area'}`
      : location
        ? `Browse schools in ${countryConfig.name}`
        : 'Set your location to find schools';

  return (
    <SafeAreaView style={styles.safe} testID="schools-screen">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>EduCal</Text>
          <View style={styles.headerRight}>
            {location && (
              <Pressable onPress={() => searchSchools(true)} testID="refresh-schools">
                <MaterialIcons name="refresh" size={24} color={Colors.primary} />
              </Pressable>
            )}
            <MaterialIcons name="notifications-none" size={24} color={Colors.onSurfaceVariant} />
          </View>
        </View>

        <Text style={styles.title}>Schools</Text>
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {lastSearchTimestamp && !searching && (
            <Text style={styles.freshnessText}>Updated {formatTimeAgo(lastSearchTimestamp)}</Text>
          )}
        </View>

        {/* Location Card */}
        <LocationCard
          location={location}
          countryConfig={countryConfig}
          onLocationSet={setLocation}
          onChangeLocation={handleChangeLocation}
        />

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

        {/* Tier Filter */}
        <View style={styles.filterRow}>
          <Pressable
            testID="filter-all"
            onPress={() => setTierFilter(null)}
            style={[styles.filterPill, !tierFilter && styles.filterPillActive]}
          >
            <Text style={[styles.filterText, !tierFilter && styles.filterTextActive]}>All</Text>
          </Pressable>
          {countryTiers.map((tier) => (
            <Pressable
              key={tier.id}
              testID={`filter-${tier.id}`}
              onPress={() => setTierFilter(tierFilter === tier.id ? null : tier.id)}
              style={[styles.filterPill, tierFilter === tier.id && styles.filterPillActive]}
            >
              <Text style={[styles.filterText, tierFilter === tier.id && styles.filterTextActive]}>
                {tier.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Loading State */}
        {searching && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>
              Finding schools near {location?.name ?? 'you'}...
            </Text>
          </View>
        )}

        {/* Results */}
        {!searching && filtered.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons
              name={location ? 'search-off' : 'location-on'}
              size={48}
              color={Colors.outlineLight}
            />
            <Text style={styles.emptyText}>
              {location
                ? 'No schools found. Try a different location or search term.'
                : 'Set your location above to discover nearby schools'}
            </Text>
          </View>
        ) : (
          !searching &&
          filtered.map((school, index) => (
            <SchoolCard
              key={`${school.name}-${index}`}
              school={school}
              index={index}
              countryCode={countryCode}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logo: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  title: { ...Typography.screenTitle, marginBottom: Spacing.xs },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  subtitle: { ...Typography.muted, flex: 1 },
  freshnessText: {
    ...Typography.muted,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginLeft: Spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.outlineLight,
    backgroundColor: Colors.surface,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
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
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.muted,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: { ...Typography.muted, marginTop: Spacing.md, textAlign: 'center' },
});
