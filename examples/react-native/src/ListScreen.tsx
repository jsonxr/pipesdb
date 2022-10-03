import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { RootStackScreenProps } from './navigation';
import { Example } from './pipesdb/Example';
import { usePipeList } from './pipesdb/usePipeList';

type Props = RootStackScreenProps<'ListScreen'>;
export const ListScreen = ({ navigation: { navigate } }: Props) => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = useStyle(isDarkMode);
  const { data, isLoading } = usePipeList<Example>('/examples', { cached: true, live: false });

  const renderItem: ListRenderItem<Example> = useCallback(
    ({ item }: ListRenderItemInfo<Example>) => {
      const handlePress = () => navigate('ViewScreen', { example: item });
      return (
        <Pressable onPress={handlePress}>
          <View>
            <Text style={styles.item}>{item.name}</Text>
          </View>
        </Pressable>
      );
    },
    [navigate, styles.item]
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={styles.root.backgroundColor}
      />
      {isLoading && <ActivityIndicator />}
      <FlatList data={data} renderItem={renderItem} style={styles.list} />
    </SafeAreaView>
  );
};

const useStyle = (isDarkMode: boolean) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          //backgroundColor: 'blue',
          backgroundColor: isDarkMode ? '#222' : '#F3F3F3',
        },
        barStyle: {
          color: isDarkMode ? 'light-content' : 'dark-content',
        },
        item: {
          fontFamily: Platform.select({ android: 'monospace', ios: 'Courier New' }),
        },
        list: {},
      }),
    [isDarkMode]
  );
};
