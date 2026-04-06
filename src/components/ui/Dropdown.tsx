import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Radius, Spacing, Shadows } from '@/constants/theme';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string | null;
  onSelect: (value: string) => void;
  placeholder?: string;
  testID?: string;
}

export function Dropdown({
  label,
  options,
  value,
  onSelect,
  placeholder = 'Select...',
  testID,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        testID={testID}
        onPress={() => setOpen(true)}
        style={styles.trigger}
      >
        <Text style={[styles.triggerText, !selected && styles.placeholder]}>
          {selected?.label ?? placeholder}
        </Text>
        <MaterialIcons
          name="keyboard-arrow-down"
          size={24}
          color={Colors.onSurfaceVariant}
        />
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.option,
                    item.value === value && styles.optionSelected,
                  ]}
                  onPress={() => {
                    onSelect(item.value);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <MaterialIcons
                      name="check"
                      size={20}
                      color={Colors.primary}
                    />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...Typography.label,
    marginBottom: Spacing.sm,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: Radius.default,
    paddingHorizontal: 20,
    minHeight: 52,
  },
  triggerText: {
    ...Typography.input,
  },
  placeholder: {
    color: Colors.onSurfaceVariant,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  menu: {
    backgroundColor: Colors.surfaceWhite,
    borderRadius: Radius.default,
    maxHeight: 300,
    ...Shadows.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineLight,
  },
  optionSelected: {
    backgroundColor: Colors.primaryContainer,
  },
  optionText: {
    ...Typography.body,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
