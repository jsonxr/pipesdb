import 'react-native-get-random-values';

import { AppRegistry } from 'react-native';
import { Root } from './src/Root';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Root);
