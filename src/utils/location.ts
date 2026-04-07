import * as ExpoLocation from 'expo-location';
import type { CountryCode } from '@/types';

const ISO_TO_COUNTRY: Record<string, CountryCode> = {
  US: 'US',
  IN: 'IN',
  ID: 'ID',
};

/**
 * Maps an ISO 3166-1 alpha-2 country code to a supported CountryCode.
 * Defaults to 'US' for unsupported countries.
 */
export function mapIsoToCountryCode(iso: string): CountryCode {
  return ISO_TO_COUNTRY[iso.toUpperCase()] ?? 'US';
}

/**
 * Reverse-geocodes coordinates to detect the country.
 * Returns null if reverse geocoding fails.
 */
export async function detectCountryFromCoordinates(
  lat: number,
  lng: number,
): Promise<{ countryCode: CountryCode; isoCode: string } | null> {
  try {
    const [geocode] = await ExpoLocation.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });
    if (!geocode?.isoCountryCode) return null;
    return {
      isoCode: geocode.isoCountryCode,
      countryCode: mapIsoToCountryCode(geocode.isoCountryCode),
    };
  } catch {
    return null;
  }
}

/**
 * Geocodes a city name to coordinates and a display name.
 * Extracts the duplicated geocoding logic from step2 into a reusable function.
 */
export async function geocodeCityToLocation(
  city: string,
): Promise<{ lat: number; lng: number; name: string } | null> {
  const query = city.trim();
  if (!query) return null;

  const results = await ExpoLocation.geocodeAsync(query);
  if (results.length === 0) return null;

  const { latitude, longitude } = results[0];
  const [geocode] = await ExpoLocation.reverseGeocodeAsync({
    latitude,
    longitude,
  });
  const name = geocode
    ? [geocode.city, geocode.region].filter(Boolean).join(', ')
    : query;

  return { lat: latitude, lng: longitude, name };
}
