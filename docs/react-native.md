`pipes.ts`

```typescript
export const open = async () => PipesDB.open({
  url: 'https://pipesdb.com/tenant1',

  // Optional...
  schema: {
    '/examples', Example.shema,
    '/examples/:exampleId/items', Item.shema,
  },
});
```

`ExampleList.jsx`

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { usePipe } from 'pipesdb';

const ExampleView = () => {
  const db = usePipesDb();
  const list: Pipe<Item[]> = usePipesList<Item[]>(db.examples);

  // What about db.examples({ parentId})?...
  //const list: Pipe<Item[]> = usePipesList<Item[]>((db) => db.examples(route.params.parentKey), [route.params.parentKey]);

  const onInsert = () => {
    const id = ulid();
    const name = 'New';
    examples.set(id, { id, name });
  };

  return (
    <View>
      <Spinner visible={list.busy} />
      <FlatList data={list.data} />
      <Button onPress={onInsert} label="Insert" />
    </View>
  );
};
```

`ExampleView.jsx`

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { usePipe } from 'pipesdb';

const ExampleView = () => {
  const id = '0001';
  const db = usePipesDb();
  const { data, isLoading } = usePipesObject(db.examples, id);

  const [item, setItem] = useState<Item>();
  useEffect(() => {
    setItem(data);
  }, [data]);

  const onNameChange = (text: string) => {
    setItem({ ...item, name: text });
  };

  const onSubmit = async () => {
    await db.examples.set(id, item);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <View>
      <TextInput value={item.name} onTextChange={onNameChange} />
      <Button onPress={onSubmit} label="Submit" />
    </View>
  );
};
```
