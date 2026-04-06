import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Layout } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { OnboardingHeader } from './_layout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChildCard } from '@/components/onboarding/ChildCard';
import { validateChild } from '@/utils/validation';
import type { TargetLevel } from '@/types';
import { TARGET_AGES } from '@/types';

const TARGET_OPTIONS = [
  { label: 'University', value: 'university' },
  { label: 'High School', value: 'high_school' },
  { label: 'Primary', value: 'primary' },
];

export default function Step1Screen() {
  const { children, addChild, removeChild, setCurrentStep } =
    useOnboardingStore();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [targetLevel, setTargetLevel] = useState<string>('university');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(children.length === 0);

  const handleSaveChild = () => {
    const currentAge = parseInt(age, 10);
    const level = targetLevel as TargetLevel;
    const { valid, errors: validationErrors } = validateChild({
      name: name.trim(),
      currentAge,
      targetLevel: level,
    });

    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    addChild({
      id: Date.now().toString(),
      name: name.trim(),
      currentAge,
      targetLevel: level,
      targetAge: TARGET_AGES[level],
    });

    setName('');
    setAge('');
    setTargetLevel('university');
    setErrors({});
    setShowForm(false);
  };

  const handleNext = () => {
    // If no children saved yet, save the current form as the first child
    if (children.length === 0 && name.trim()) {
      const currentAge = parseInt(age, 10);
      const level = targetLevel as TargetLevel;
      const { valid, errors: validationErrors } = validateChild({
        name: name.trim(),
        currentAge,
        targetLevel: level,
      });

      if (!valid) {
        setErrors(validationErrors);
        return;
      }

      addChild({
        id: Date.now().toString(),
        name: name.trim(),
        currentAge,
        targetLevel: level,
        targetAge: TARGET_AGES[level],
      });
    }

    if (children.length === 0 && !name.trim()) return;

    setCurrentStep(2);
    router.push('/onboarding/step2');
  };

  const canProceed = children.length > 0 || name.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe} testID="step1-screen">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <OnboardingHeader step={1} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero */}
          <View testID="step1-hero-image" style={styles.hero}>
            <MaterialIcons name="family-restroom" size={64} color={Colors.primary} />
          </View>

          {/* Progress */}
          <ProgressBar
            testID="step1-progress-bar"
            progress={0.25}
            label="ONBOARDING PROGRESS"
          />

          {/* Heading */}
          <Text style={styles.title}>Build Your Family Profile</Text>
          <Text style={styles.subtitle}>
            Tell us more about your children to personalize their education
            trajectory.
          </Text>

          {/* Saved Child Cards */}
          {children.map((child, index) => (
            <View key={child.id} style={styles.childCardWrap}>
              <ChildCard child={child} index={index} onRemove={removeChild} />
            </View>
          ))}

          {/* Add Child Form */}
          {(showForm || children.length === 0) && (
            <Card variant="outlined" style={styles.formCard}>
              <Input
                testID="child-name-input"
                label="CHILD'S NAME"
                placeholder="e.g. Sophia"
                value={name}
                onChangeText={setName}
                error={errors.name}
                autoCapitalize="words"
              />

              <Input
                testID="child-age-input"
                label="CURRENT AGE"
                placeholder="5"
                value={age}
                onChangeText={setAge}
                error={errors.age}
                keyboardType="number-pad"
                maxLength={2}
                containerStyle={{ marginTop: Spacing.md }}
              />

              <View style={{ marginTop: Spacing.md }}>
                <Dropdown
                  testID="child-target-level"
                  label="TARGET LEVEL"
                  options={TARGET_OPTIONS}
                  value={targetLevel}
                  onSelect={setTargetLevel}
                  placeholder="Select target level"
                />
              </View>

              {children.length > 0 && (
                <Button
                  testID="save-child-button"
                  title="Save Child Details"
                  onPress={handleSaveChild}
                  icon="check"
                  style={{ marginTop: Spacing.lg }}
                />
              )}
            </Card>
          )}

          {/* Add Another Child */}
          {children.length > 0 && !showForm && (
            <Button
              testID="add-another-child"
              title="+ Add another child"
              variant="text"
              onPress={() => setShowForm(true)}
              style={{ marginTop: Spacing.md, alignSelf: 'flex-start' }}
            />
          )}

          {/* Info Card */}
          <Card
            testID="step1-info-card"
            variant="filled"
            style={styles.infoCard}
          >
            <View style={styles.infoRow}>
              <MaterialIcons
                name="lightbulb-outline"
                size={20}
                color={Colors.primaryDark}
              />
              <Text style={styles.infoTitle}>Why this matters</Text>
            </View>
            <Text style={styles.infoText}>
              Your child's age determines how many years of investment growth we
              can factor in. Younger children benefit from longer compounding
              periods, which can significantly reduce the monthly savings needed.
            </Text>
          </Card>
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <Button
            testID="step1-next-button"
            title="NEXT"
            onPress={handleNext}
            disabled={!canProceed}
            icon="arrow-forward"
            iconPosition="right"
            style={{ flex: 1 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingBottom: 100,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.default,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.heading,
    fontSize: 24,
    marginTop: Spacing.lg,
  },
  subtitle: {
    ...Typography.muted,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  childCardWrap: {
    marginBottom: Spacing.md,
  },
  formCard: {
    marginTop: Spacing.sm,
  },
  infoCard: {
    marginTop: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoTitle: {
    ...Typography.cardHeading,
    fontSize: 14,
    color: Colors.primaryDark,
  },
  infoText: {
    ...Typography.muted,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.primaryDark,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineLight,
    backgroundColor: Colors.surfaceWhite,
  },
});
