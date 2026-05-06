import { Platform } from 'react-native';

// Local backend defaults:
// - Android emulator: http://10.0.2.2:<port>
// - iOS simulator: http://localhost:<port>
const LOCAL_PORT = 5009;
const LOCAL_BASE_URL =
  Platform.OS === 'android'
    ? `http://10.0.2.2:${LOCAL_PORT}`
    : `http://localhost:${LOCAL_PORT}`;

export const BASE_URL = __DEV__ ? LOCAL_BASE_URL : 'https://api.mdtelemed.com';
export const API_URL = BASE_URL;
