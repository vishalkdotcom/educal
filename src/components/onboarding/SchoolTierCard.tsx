import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Radius, Spacing, Shadows } from '@/constants/theme';
import { formatCurrencyCompact } from '@/utils/format';
import type { SchoolTier, SchoolTierId } from '@/types';

interface SchoolTierCardProps {
  tier: SchoolTier;
  selected: boolean;
  onSelect: (id: SchoolTierId) => void;
  testID?: string;
}

export function SchoolTierCard({
  tier,
  selected,
  onSelect,
  testID,
}: SchoolTierCardProps) {
  const isInternational = tier.id === 'international';

  return (
    <Pressable
      testID={testID}
      onPress={() => onSelect(tier.id)}
      style={[
        styles.container,
        isInternational && styles.international,
        selected && styles.selected,
      ]}
    >
      {selected && <View style={styles.leftAccent} />}
      <View style={styles.header}>
        <View
          style={[
            styles.iconCircle,
            isInternational && styles.iconCircleInternational,
          ]}
        >
          <MaterialIcons
            name={tier.icon as keyof typeof MaterialIcons.glyphMap}
            size={24}
            color={isInternational ? '#FFFFFF' : Colors.primary}
          />
        </View>
        <View style={styles.headerText}>
          <Text
            style={[styles.label, isInternational && styles.labelInternational]}
          >
            {tier.label}
          </Text>
          {tier.schools.length > 0 && (
            <Text
              style={[
                styles.schoolNames,
                isInternational && styles.textWhite,
              ]}
              numberOfLines={1}
            >
              {tier.schools
                .slice(0, 2)
                .map((s) => s.name.toUpperCase())
                .join(' • ')}
            </Text>
          )}
        </View>
      </View>

      <Text
        style={[
          styles.description,
          isInternational && styles.descriptionInternational,
        ]}
      >
        {tier.description}
      </Text>

      <View style={styles.costRow}>
        <Text
          style={[
            styles.costLabel,
            isInternational && styles.costLabelInternational,
          ]}
        >
          EST. TOTAL COST
        </Text>
        <Text
          style={[
            styles.costRange,
            isInternational && styles.costRangeInternational,
          ]}
        >
          {formatCurrencyCompact(tier.costRange.min)} —{' '}
          {formatCurrencyCompact(tier.costRange.max)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceWhite,
    borderRadius: Radius.default,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.outlineLight,
    ...Shadows.sm,
    overflow: 'hidden',
  },
  international: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: Radius.default,
    borderBottomLeftRadius: Radius.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleInternational: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  label: {
    ...Typography.cardHeading,
  },
  labelInternational: {
    color: '#FFFFFF',
  },
  schoolNames: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  textWhite: {
    color: 'rgba(255,255,255,0.7)',
  },
  description: {
    ...Typography.muted,
    marginBottom: Spacing.md,
  },
  descriptionInternational: {
    color: 'rgba(255,255,255,0.85)',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  costLabelInternational: {
    color: 'rgba(255,255,255,0.7)',
  },
  costRange: {
    ...Typography.cardHeading,
    fontSize: 16,
    color: Colors.primary,
  },
  costRangeInternational: {
    color: '#FFFFFF',
  },
});
