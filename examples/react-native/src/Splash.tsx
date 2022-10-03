import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

export const Splash = () => {
  const styles = useStyle();
  return (
    <View style={styles.root}>
      <Text>Loading...</Text>
    </View>
  );
};

const useStyle = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDarkMode ? 'black' : 'white',
        },
      }),
    [isDarkMode]
  );
};
