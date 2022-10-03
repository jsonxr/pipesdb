import React from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { RootStackScreenProps } from './navigation';
import { Example } from './pipesdb/Example';
import { usePipeObject } from './pipesdb/usePipeObject';

type Props = RootStackScreenProps<'ViewScreen'>;
export const ViewScreen = ({ route, navigation: { navigate } }: Props) => {
  const example = route.params.example;

  // data will be deepEqual to example but not shallow equal
  const { data, isLoading } = usePipeObject<Example>('/examples', example.key, { cached: true, live: true });
  console.log('ViewScreen data=', data);
  console.log('example=', example);

  if (!data || isLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      <Text>View Screen</Text>
      <Text>{data.key}</Text>
      <Text>Name: {data.name}</Text>
      <Button title="back" onPress={() => navigate('ListScreen')} />
    </View>
  );
};
