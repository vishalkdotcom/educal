import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Layout } from '@/constants/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} testID="profile-screen">
      <View style={styles.container}>
        <Text style={styles.title}>Profile & Settings</Text>
        <Text style={styles.subtitle}>Profile — built in Phase 6</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  title: { ...Typography.screenTitle, marginBottom: 8 },
  subtitle: { ...Typography.muted, textAlign: 'center' },
});
