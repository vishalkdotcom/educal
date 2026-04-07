import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Radius, Spacing, Shadows } from '@/constants/theme';
import { formatCurrency } from '@/utils/format';
import { Card } from '@/components/ui/Card';
import type { CountryCode, SavingsResult as SavingsResultType } from '@/types';

interface SavingsPlanProps {
  result: SavingsResultType;
  countryCode?: CountryCode;
  testID?: string;
}

export function SavingsPlanCard({ result, countryCode = 'US', testID }: SavingsPlanProps) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View testID={testID}>
      {/* Hero Result Card */}
      <Card variant="elevated" style={styles.heroCard}>
        <View style={styles.targetRow}>
          <MaterialIcons
            name="trending-up"
            size={20}
            color={Colors.success}
          />
          <Text style={styles.targetText}>
            Target Reached by {result.targetYear}
          </Text>
        </View>

        <Animated.Text
          testID="savings-goal-amount"
          style={[styles.amount, { opacity: animValue }]}
        >
          {formatCurrency(result.totalMonthly, countryCode)}
          <Text style={styles.amountUnit}>/mo</Text>
        </Animated.Text>

        <Text style={styles.description}>
          This target ensures full coverage for tuition, boarding, and annual
          inflation adjustments for{' '}
          {result.perChild.length === 1
            ? 'your child'
            : result.perChild.length === 2
              ? 'both children'
              : `all ${result.perChild.length} children`}
          .
        </Text>
      </Card>

      {/* Per-Child Breakdown */}
      {result.perChild.map((child, index) => (
        <Card
          key={child.childId}
          testID={`child-breakdown-${index}`}
          variant="outlined"
          style={styles.childCard}
        >
          <View style={styles.childRow}>
            <View style={styles.childAvatar}>
              <MaterialIcons
                name="child-care"
                size={20}
                color={Colors.primary}
              />
            </View>
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.childName}</Text>
              <Text style={styles.childDetail}>
                Class of {child.classOf} • {child.yearsToSave} Years to Save
              </Text>
            </View>
            <View style={styles.childAmount}>
              <Text style={styles.shareLabel}>Monthly Share</Text>
              <Text
                testID={`child-share-${index}`}
                style={styles.shareAmount}
              >
                {formatCurrency(child.monthlyShare, countryCode)}
              </Text>
            </View>
          </View>
        </Card>
      ))}

      {/* Funded Percentage */}
      <View style={styles.fundedRow}>
        <Text style={styles.fundedLabel}>Currently Funded</Text>
        <Text style={styles.fundedValue}>
          {result.currentFunded.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  targetText: {
    ...Typography.label,
    color: Colors.success,
  },
  amount: {
    ...Typography.stat,
    marginBottom: Spacing.md,
  },
  amountUnit: {
    fontSize: 20,
    fontWeight: '400',
    color: Colors.onSurfaceVariant,
  },
  description: {
    ...Typography.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  childCard: {
    marginTop: Spacing.md,
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
  fundedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.default,
  },
  fundedLabel: {
    ...Typography.label,
    color: Colors.primaryDark,
  },
  fundedValue: {
    ...Typography.cardHeading,
    color: Colors.primaryDark,
  },
});
