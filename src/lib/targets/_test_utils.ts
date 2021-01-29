import { AppContext } from '../AppContext';

export const APP_CONTEXT_WITHOUT_VERSION: AppContext = {
  name: 'hello-world',
};

export const APP_CONTEXT_WITH_VERSION: AppContext = {
  ...APP_CONTEXT_WITHOUT_VERSION,
  version: '1.0.3',
};

export type LevelFormatter = (level: string, number: number) => object;
export type LogFormatter = (object: object) => object;
