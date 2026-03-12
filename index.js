/**
 * @format
 */

import 'react-native-gesture-handler'; // Must be first import!
import 'react-native-reanimated'; // Must be imported early for worklets
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
