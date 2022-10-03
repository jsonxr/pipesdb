import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Example } from './pipesdb/Example';

export type RootStackParamList = {
  ListScreen: undefined;
  ViewScreen: { example: Example };
};
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

declare global {
  // Enables type safety...
  //    const nav = useNavigation();
  //    nav.navigate('ListScreen'); <- Code completion enabled here
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
