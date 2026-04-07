import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { detectCountryFromCoordinates, geocodeCityToLocation, mapIsoToCountryCode } from '@/utils/location';
import type { Location as LocationType, CountryCode, CountryConfig } from '@/types';
import type { ViewStyle } from 'react-native';

interface LocationCardProps {
  location: LocationType | null;
  countryConfig: CountryConfig;
  onLocationSet: (
    loc: { lat: number; lng: number; name: string },
    source: 'gps' | 'city',
    detectedCountryCode?: CountryCode,
  ) => void;
  onChangeLocation: () => void;
  style?: ViewStyle;
}

export function LocationCard({
  location,
  countryConfig,
  onLocationSet,
  onChangeLocation,
  style,
}: LocationCardProps) {
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [citySearching, setCitySearching] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);

  const handleUseLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationDenied(true);
        setLocationLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const name = geocode
        ? [geocode.city, geocode.region].filter(Boolean).join(', ')
        : `${loc.coords.latitude.toFixed(2)}, ${loc.coords.longitude.toFixed(2)}`;

      const detectedCountryCode = geocode?.isoCountryCode
        ? mapIsoToCountryCode(geocode.isoCountryCode)
        : undefined;

      onLocationSet(
        { lat: loc.coords.latitude, lng: loc.coords.longitude, name },
        'gps',
        detectedCountryCode,
      );
      setLocationDenied(false);
    } catch {
      Alert.alert('Location Error', 'Unable to get your location. Try entering a city instead.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleCitySearch = async () => {
    const query = cityInput.trim();
    if (!query) return;
    setCitySearching(true);
    setCityError(null);
    try {
      const result = await geocodeCityToLocation(query);
      if (!result) {
        setCityError('Could not find that location. Try a different city name.');
        return;
      }

      const detected = await detectCountryFromCoordinates(result.lat, result.lng);
      onLocationSet(
        { lat: result.lat, lng: result.lng, name: result.name },
        'city',
        detected?.countryCode,
      );
      setLocationDenied(false);
    } catch {
      setCityError('Search failed. Check your connection and try again.');
    } finally {
      setCitySearching(false);
    }
  };

  return (
    <Card variant="outlined" style={[styles.card, style]}>
      <View style={styles.header}>
        <MaterialIcons name="location-on" size={24} color={Colors.primary} />
        <Text style={styles.title}>Your Location</Text>
      </View>

      {location ? (
        <View testID="location-status" style={styles.success}>
          <MaterialIcons name="check-circle" size={20} color={Colors.success} />
          <View style={styles.textWrap}>
            <Text style={styles.locationName}>{location.name}</Text>
            <Text style={styles.countryDetected}>
              {countryConfig.name} {countryConfig.currency.symbol}
            </Text>
          </View>
          <Pressable
            testID="location-change"
            onPress={onChangeLocation}
            style={styles.changeLink}
          >
            <Text style={styles.changeLinkText}>Change</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.options}>
          <Button
            testID="use-location-button"
            title="Use my location"
            onPress={handleUseLocation}
            icon="my-location"
            loading={locationLoading}
          />
          {locationDenied && (
            <Text testID="location-denied" style={styles.denied}>
              Location permission denied. Enter a city below instead.
            </Text>
          )}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.cityRow}>
            <Input
              testID="city-input"
              label=""
              placeholder="Enter a city (e.g. Mumbai, Jakarta)"
              value={cityInput}
              onChangeText={(t) => { setCityInput(t); setCityError(null); }}
              error={cityError ?? undefined}
              containerStyle={{ flex: 1 }}
            />
            <Button
              testID="city-search-button"
              title=""
              icon="search"
              onPress={handleCitySearch}
              loading={citySearching}
              disabled={!cityInput.trim()}
              style={styles.citySearchBtn}
            />
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.cardHeading,
  },
  success: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: '#F0FDF4',
    borderRadius: Radius.default,
  },
  textWrap: {
    flex: 1,
  },
  locationName: {
    ...Typography.body,
    color: Colors.success,
    fontWeight: '600',
  },
  countryDetected: {
    ...Typography.muted,
    fontSize: 12,
    marginTop: 2,
  },
  changeLink: {
    marginLeft: 'auto',
  },
  changeLinkText: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 12,
  },
  options: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  denied: {
    ...Typography.muted,
    fontSize: 12,
    color: Colors.warning,
    marginTop: Spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineLight,
  },
  dividerText: {
    ...Typography.muted,
    fontSize: 12,
    marginHorizontal: Spacing.md,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  citySearchBtn: {
    marginTop: 0,
    height: 48,
    width: 48,
    paddingHorizontal: 0,
  },
});
