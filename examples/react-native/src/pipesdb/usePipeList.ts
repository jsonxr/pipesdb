import { useEffect, useMemo, useState } from 'react';
import { createList, db, getExample } from './Example';
import { PipeOptions } from './PipesDB';

export function usePipeList<T>(_path: string, options?: PipeOptions) {
  // The initial object from the cache...
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T[]>(() => {
    if (options?.cached) {
      return db.examples as any;
    }

    return [];
  });

  // Simulate getting data from the server...
  useEffect(() => {
    setTimeout(() => {
      db.examples = createList('server');
      setData([...(db.examples as any)]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Simulate a subscription if we want live data
  useEffect(() => {
    if (!options?.live) {
      return;
    }

    const interval = setInterval(() => {
      console.log('tick');
      setIsLoading(false);
      db.examples.push(getExample('live'));
      setData([...(db.examples as any)]);
    }, 3000);
    return () => {
      clearInterval(interval);
      data.splice(0, data.length);
    };
  }, [options?.live, data]);

  const result = useMemo(() => {
    return { isLoading, data };
  }, [isLoading, data]);

  return result;
}
