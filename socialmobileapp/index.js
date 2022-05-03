/**
 * @format
 */

import {AppRegistry, LogBox, YellowBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

LogBox.ignoreLogs([
  'NativeBase:',
  'AsyncStorage has been extracted from react-native core',
  'Possible Unhandled',
  'RCTBridge',
  'When server rendering',
  "Can't perform a react",
  'Warning: Each child in a list should have a unique "key" prop.',
  'The file',
  'Failed prop type',
]);

console.reportErrorsAsExceptions = false;
AppRegistry.registerComponent(appName, () => App);
