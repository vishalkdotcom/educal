import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Radius, Spacing, Shadows } from '@/constants/theme';
import { Dropdown } from '@/components/ui/Dropdown';
import type { Child, TargetLevel } from '@/types';
import { TARGET_AGES } from '@/types';
import { formatAge } from '@/utils/format';
import { validateChild } from '@/utils/validation';

const TARGET_LABELS: Record<string, string> = {
  primary: 'Primary',
  high_school: 'High School',
  university: 'University',
};

const TARGET_OPTIONS = [
  { label: 'University', value: 'university' },
  { label: 'High School', value: 'high_school' },
  { label: 'Primary', value: 'primary' },
];

interface ChildCardProps {
  child: Child;
  index: number;
  editing?: boolean;
  onSave?: (id: string, updates: Partial<Child>) => void;
  onCancelNew?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function ChildCard({
  child,
  index,
  editing: initialEditing = false,
  onSave,
  onCancelNew,
  onRemove,
}: ChildCardProps) {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [name, setName] = useState(child.name);
  const [age, setAge] = useState(child.currentAge > 0 ? String(child.currentAge) : '');
  const [targetLevel, setTargetLevel] = useState<string>(child.targetLevel);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isNew = !child.name;

  const handleSave = () => {
    const parsedAge = parseInt(age, 10);
    const level = targetLevel as TargetLevel;
    const { valid, errors: validationErrors } = validateChild({
      name: name.trim(),
      currentAge: parsedAge,
      targetLevel: level,
    });

    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSave?.(child.id, {
      name: name.trim(),
      currentAge: parsedAge,
      targetLevel: level,
      targetAge: TARGET_AGES[level],
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (isNew) {
      onCancelNew?.(child.id);
    } else {
      // Reset to original values
      setName(child.name);
      setAge(String(child.currentAge));
      setTargetLevel(child.targetLevel);
      setErrors({});
      setIsEditing(false);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Child',
      `Remove ${child.name || 'this child'} from your plan?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => onRemove?.(child.id) },
      ],
    );
  };

  // --- Editing mode ---
  if (isEditing) {
    return (
      <View testID={`child-card-${index}`} style={[styles.container, styles.editingContainer]}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>CHILD'S NAME</Text>
          <TextInput
            testID={`child-name-input-${index}`}
            style={[styles.fieldInput, errors.name && styles.fieldInputError]}
            placeholder="e.g. Sophia"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>CURRENT AGE</Text>
          <TextInput
            testID={`child-age-input-${index}`}
            style={[styles.fieldInput, errors.age && styles.fieldInputError]}
            placeholder="5"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            maxLength={2}
          />
          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Dropdown
            testID={`child-target-level-${index}`}
            label="TARGET LEVEL"
            options={TARGET_OPTIONS}
            value={targetLevel}
            onSelect={setTargetLevel}
            placeholder="Select target level"
          />
        </View>

        <View style={styles.editActions}>
          <Pressable
            testID={`child-save-${index}`}
            style={styles.saveBtn}
            onPress={handleSave}
          >
            <MaterialIcons name="check" size={18} color={Colors.surfaceWhite} />
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>
          <Pressable
            testID={`child-cancel-${index}`}
            style={styles.cancelBtn}
            onPress={handleCancel}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // --- Viewing mode ---
  return (
    <Pressable
      testID={`child-card-${index}`}
      style={styles.container}
      onPress={() => setIsEditing(true)}
    >
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
        <Pressable
          testID={`child-edit-${index}`}
          onPress={() => setIsEditing(true)}
          hitSlop={8}
          style={styles.iconBtn}
        >
          <MaterialIcons name="edit" size={18} color={Colors.onSurfaceVariant} />
        </Pressable>
        {onRemove && (
          <Pressable
            testID={`child-remove-${index}`}
            onPress={handleRemove}
            hitSlop={8}
            style={styles.iconBtn}
          >
            <MaterialIcons name="close" size={18} color={Colors.onSurfaceVariant} />
          </Pressable>
        )}
      </View>
    </Pressable>
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
  editingContainer: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
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
  iconBtn: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
  // Editing styles
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: Colors.outlineLight,
    borderRadius: Radius.default,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.onSurface,
    backgroundColor: Colors.surface,
  },
  fieldInputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.default,
  },
  saveBtnText: {
    color: Colors.surfaceWhite,
    fontWeight: '600',
    fontSize: 14,
  },
  cancelBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.default,
    borderWidth: 1,
    borderColor: Colors.outlineLight,
  },
  cancelBtnText: {
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    fontSize: 14,
  },
});
