import { useCallback } from 'react';
import { useOnboardingStore, locationChangedMeaningfully } from '@/stores/useOnboardingStore';
import { searchAllSchoolTiers } from '@/services/gemini';

const STALE_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

export function useSchoolSearch() {
  const location = useOnboardingStore((s) => s.location);
  const children = useOnboardingStore((s) => s.children);
  const countryCode = useOnboardingStore((s) => s.countryCode);
  const searchStatus = useOnboardingStore((s) => s.searchStatus);
  const lastSearchLocation = useOnboardingStore((s) => s.lastSearchLocation);
  const lastSearchTimestamp = useOnboardingStore((s) => s.lastSearchTimestamp);
  const schoolResults = useOnboardingStore((s) => s.schoolResults);
  const searchError = useOnboardingStore((s) => s.searchError);
  const setSchoolResults = useOnboardingStore((s) => s.setSchoolResults);
  const setSearchStatus = useOnboardingStore((s) => s.setSearchStatus);
  const setLastSearchLocation = useOnboardingStore((s) => s.setLastSearchLocation);

  const hasGeminiResults = schoolResults.some((s) => s.source === 'gemini');

  const needsSearch = useCallback((): boolean => {
    if (!location) return false;
    if (searchStatus === 'searching') return false;
    // Location changed meaningfully since last search
    if (locationChangedMeaningfully(lastSearchLocation, location)) return true;
    // No results at all
    if (schoolResults.length === 0) return true;
    // Only fallback data and last search was stale (or never happened)
    if (!hasGeminiResults && (!lastSearchTimestamp || Date.now() - lastSearchTimestamp > STALE_THRESHOLD_MS)) return true;
    return false;
  }, [location, searchStatus, lastSearchLocation, schoolResults.length, hasGeminiResults, lastSearchTimestamp]);

  const search = useCallback(async (force = false) => {
    if (!location) return;
    if (!force && !needsSearch()) return;
    if (searchStatus === 'searching') return;

    setSearchStatus('searching');
    setLastSearchLocation({ lat: location.lat, lng: location.lng });

    try {
      const childAges = children.map((c) => c.currentAge);
      const results = await searchAllSchoolTiers({
        latitude: location.lat,
        longitude: location.lng,
        countryCode,
        childAges,
      });
      const allSchools = [...results.public, ...results.private, ...results.international];
      if (allSchools.length > 0) {
        setSchoolResults(allSchools);
      }
      setSearchStatus('done');
    } catch {
      setSearchStatus('error', 'Search failed. You can enter a cost manually.');
    }
  }, [location, children, countryCode, searchStatus, needsSearch]);

  return { search, needsSearch, searchStatus, searchError, hasGeminiResults, lastSearchTimestamp };
}
