import React, { useEffect, useMemo, useState } from 'react';
import { PipesDB } from './pipesdb/PipesDB';
import { PipesDBProvider } from './pipesdb';
import { App } from './App';
import { Splash } from './Splash';

export const Root = () => {
  const pipes = useMemo(() => new PipesDB({ url: '' }), []);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    pipes.connect().then(value => {
      setConnected(value);
    });
  }, [pipes]);

  if (!connected) {
    return <Splash />;
  }

  return (
    <PipesDBProvider value={pipes}>
      <App />
    </PipesDBProvider>
  );
};
