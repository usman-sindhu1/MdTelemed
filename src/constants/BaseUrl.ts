// export const BASE_URL = `https://api.mdtelemed.com`;
// export const API_URL = BASE_URL;


 import { Platform } from 'react-native';

/**
 * Dev note:
 * - iOS simulator can use localhost to reach your Mac.
 * - Android emulator must use 10.0.2.2 to reach your Mac's localhost.
 * - Physical device must use your Mac's LAN IP (e.g. http://192.168.x.x:5009).
 */
const DEV_PORT = 5009;
const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const BASE_URL = __DEV__ ? `http://${DEV_HOST}:${DEV_PORT}` : `http://${DEV_HOST}:${DEV_PORT}`;
export const API_URL = BASE_URL;
