import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Layout } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { OnboardingHeader } from './_layout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChildCard } from '@/components/onboarding/ChildCard';
import type { Child, TargetLevel } from '@/types';
import { TARGET_AGES } from '@/types';

export default function Step1Screen() {
  const { children, addChild, updateChild, removeChild, setCurrentStep } =
    useOnboardingStore();

  // Track IDs of cards currently being created (unsaved new cards)
  const [pendingIds, setPendingIds] = useState<string[]>(() =>
    children.length === 0 ? [createPendingId()] : [],
  );
  // Track IDs of cards currently in edit mode (existing saved cards)
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());

  const handleAddChild = () => {
    const id = createPendingId();
    setPendingIds((prev) => [...prev, id]);
  };

  const handleSaveNew = useCallback(
    (id: string, updates: Partial<Child>) => {
      addChild({
        id,
        name: updates.name!,
        currentAge: updates.currentAge!,
        targetLevel: updates.targetLevel as TargetLevel,
        targetAge: TARGET_AGES[updates.targetLevel as TargetLevel],
      });
      setPendingIds((prev) => prev.filter((pid) => pid !== id));
    },
    [addChild],
  );

  const handleSaveExisting = useCallback(
    (id: string, updates: Partial<Child>) => {
      updateChild(id, updates);
      setEditingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [updateChild],
  );

  const handleCancelNew = useCallback((id: string) => {
    setPendingIds((prev) => prev.filter((pid) => pid !== id));
  }, []);

  const handleRemove = useCallback(
    (id: string) => {
      removeChild(id);
      setEditingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [removeChild],
  );

  const hasUnsaved = pendingIds.length > 0 || editingIds.size > 0;
  const canProceed = children.length > 0 && !hasUnsaved;

  const handleNext = () => {
    if (!canProceed) return;
    setCurrentStep(2);
    router.push('/onboarding/step2');
  };

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
            <Image
              source={require('../../../assets/images/hero-family.jpg')}
              style={styles.heroImage}
            />
          </View>

          {/* Progress */}
          <ProgressBar
            testID="step1-progress-bar"
            progress={0.33}
            label="ONBOARDING PROGRESS"
          />

          {/* Heading */}
          <Text style={styles.title}>Who are you saving for?</Text>
          <Text style={styles.subtitle}>
            Tell us about your children so we can personalize their savings
            plan.
          </Text>

          {/* Saved Child Cards (view or edit mode) */}
          {children.map((child, index) => (
            <View key={child.id} style={styles.childCardWrap}>
              <ChildCard
                child={child}
                index={index}
                editing={editingIds.has(child.id)}
                onSave={handleSaveExisting}
                onRemove={handleRemove}
              />
            </View>
          ))}

          {/* Pending new cards (always in edit mode) */}
          {pendingIds.map((id, i) => (
            <View key={id} style={styles.childCardWrap}>
              <ChildCard
                child={makePendingChild(id)}
                index={children.length + i}
                editing={true}
                onSave={handleSaveNew}
                onCancelNew={handleCancelNew}
                onRemove={handleCancelNew}
              />
            </View>
          ))}

          {/* Add Child Button — always visible */}
          <Button
            testID="add-another-child"
            title="+ Add Child"
            variant="text"
            onPress={handleAddChild}
            style={{ marginTop: Spacing.md, alignSelf: 'flex-start' }}
          />

          {/* Hint when cards are unsaved */}
          {hasUnsaved && children.length > 0 && (
            <Text style={styles.hintText}>
              Save or cancel all edits before continuing.
            </Text>
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

function createPendingId() {
  return `pending-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function makePendingChild(id: string): Child {
  return {
    id,
    name: '',
    currentAge: 0,
    targetLevel: 'university',
    targetAge: 18,
  };
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
    height: 200,
    borderRadius: Radius.default,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  hintText: {
    ...Typography.muted,
    fontSize: 13,
    color: '#F59E0B',
    marginTop: Spacing.xs,
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
