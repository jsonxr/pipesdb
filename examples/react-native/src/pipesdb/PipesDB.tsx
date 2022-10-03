import React, { useContext } from 'react';

export type PipesDBOptions = {
  url: string;
};

const delay = async (ms: number) => new Promise(resolve => setTimeout(() => resolve(undefined), ms));

export class PipesDB {
  connected: boolean = false;
  constructor(public readonly options: PipesDBOptions) {}
  async connect(): Promise<boolean> {
    await delay(100);
    this.connected = true;
    return this.connected;
  }
  getPipe(): any {}
}

export const PipesDBContext = React.createContext<any | null>(null);

export interface PipesDBroviderProps {
  children: any;
  value: PipesDB;
}
export function PipesDBProvider({ children, value }: PipesDBroviderProps) {
  return <PipesDBContext.Provider value={value}>{children}</PipesDBContext.Provider>;
}

export function usePipesDB(): PipesDB {
  const database = useContext<PipesDB | null>(PipesDBContext);
  if (!database) {
    throw new Error('must be within a PipesDBProvider');
  }
  return database;
}

export type PipeOptions = {
  cached?: boolean;
  live?: boolean;
};
