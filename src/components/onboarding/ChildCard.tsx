import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Radius, Spacing, Shadows } from '@/constants/theme';
import type { Child } from '@/types';
import { formatAge } from '@/utils/format';

const TARGET_LABELS: Record<string, string> = {
  primary: 'Primary',
  high_school: 'High School',
  university: 'University',
};

interface ChildCardProps {
  child: Child;
  index: number;
  onRemove?: (id: string) => void;
}

export function ChildCard({ child, index, onRemove }: ChildCardProps) {
  return (
    <View testID={`child-card-${index}`} style={styles.container}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <MaterialIcons name="child-care" size={24} color={Colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{child.name}</Text>
          <Text style={styles.detail}>
            {formatAge(child.currentAge)} • {TARGET_LABELS[child.targetLevel]}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ACTIVE</Text>
        </View>
        {onRemove && (
          <Pressable
            onPress={() => onRemove(child.id)}
            hitSlop={8}
            style={styles.removeBtn}
          >
            <MaterialIcons name="close" size={18} color={Colors.onSurfaceVariant} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceWhite,
    borderRadius: Radius.default,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineLight,
    ...Shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    ...Typography.cardHeading,
    fontSize: 16,
  },
  detail: {
    ...Typography.muted,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.default,
  },
  badgeText: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.primary,
  },
  removeBtn: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
});
