import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

const NOMINATIM_REVERSE =
  'https://nominatim.openstreetmap.org/reverse?format=jsonv2';

async function reverseGeocodeLabel(lat: number, lon: number): Promise<string> {
  const url = `${NOMINATIM_REVERSE}&lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'MdTelemedPatient/1.0 (react-native)',
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('reverse-geocode');
  }
  const j = (await res.json()) as { display_name?: string };
  const d = j.display_name?.trim();
  if (!d) throw new Error('no-label');
  return d.length > 90 ? `${d.slice(0, 87)}…` : d;
}

/** Lazy-load so the app does not crash at bundle evaluation when the native module is not linked yet. */
function loadGeolocationModule():
  | typeof import('@react-native-community/geolocation').default
  | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@react-native-community/geolocation').default;
  } catch {
    return null;
  }
}

function getCurrentPosition(): Promise<{
  coords: { latitude: number; longitude: number };
}> {
  return new Promise((resolve, reject) => {
    const Geolocation = loadGeolocationModule();
    if (!Geolocation) {
      reject(new Error('geolocation-native-unavailable'));
      return;
    }
    try {
      Geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 22000,
        maximumAge: 30000,
      });
    } catch (e) {
      reject(e instanceof Error ? e : new Error('geolocation-call-failed'));
    }
  });
}

async function requestForegroundLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const r = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return r === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

/**
 * Resolves a short address line: **device location** (reverse geocode) when allowed,
 * otherwise **saved profile `address`**, then a simple fallback.
 */
export function useLocationDisplay(savedAddress?: string | null) {
  const saved = savedAddress?.trim() ?? '';
  const [fromGps, setFromGps] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const resolve = useCallback(async () => {
    setLoading(true);
    try {
      const ok = await requestForegroundLocationPermission();
      if (!ok) {
        setFromGps(null);
        return;
      }
      const pos = await getCurrentPosition();
      const label = await reverseGeocodeLabel(
        pos.coords.latitude,
        pos.coords.longitude,
      );
      setFromGps(label);
    } catch {
      setFromGps(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void resolve();
  }, [resolve]);

  const locationLine =
    fromGps ??
    (saved || (loading ? 'Getting location…' : 'Location unavailable'));

  return { locationLine, loading, refresh: resolve };
}
