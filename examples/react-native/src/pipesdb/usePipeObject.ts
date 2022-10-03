import { useEffect, useMemo, useState } from 'react';
import { getExample } from './Example';
import { PipeOptions } from './PipesDB';

export function usePipeObject<T>(path: string, key: string, options?: PipeOptions) {
  // The initial object from the cache...
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | undefined>(() => {
    if (options?.cached) {
      return getExample('cache');
    }

    return undefined;
  });

  // Simulate getting data from the server...
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setData(getExample('server'));
    }, 1000);
  }, []);

  // Simulate a subscription if we want live data
  useEffect(() => {
    if (!options?.live) {
      console.log('not live');
      return;
    }

    const interval = setInterval(() => {
      const example = getExample('live2');
      console.log('new data', example);
      setData(example);
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [options?.live]);

  const result = useMemo(() => {
    console.log('recalculate...');
    return { isLoading, data };
  }, [isLoading, data]);

  return result;
}
