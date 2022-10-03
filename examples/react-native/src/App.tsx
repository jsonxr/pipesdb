import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ListScreen } from './ListScreen';
import { RootStackParamList } from './navigation';
import { ViewScreen } from './ViewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ListScreen" component={ListScreen} />
        <Stack.Screen name="ViewScreen" component={ViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
