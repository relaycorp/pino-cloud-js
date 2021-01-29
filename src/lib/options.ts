import { LoggerOptions } from 'pino';

import { AppContext } from './AppContext';
import gcpOptionsGenerator from './targets/gcp';

/**
 * The environment where logs will be ingested.
 */
export type LoggingTarget = 'gcp';

type OptionGenerator = (context?: AppContext) => Partial<LoggerOptions>;

const OPTION_GENERATORS: { readonly [key in LoggingTarget]: OptionGenerator } = {
  gcp: gcpOptionsGenerator,
};

/**
 * Generate options to integrate `target` in Pino.
 *
 * @param target
 * @param appContext
 */
export function getPinoOptions(
  target?: LoggingTarget,
  appContext?: AppContext,
): Partial<LoggerOptions> {
  const optionsGenerator = target ? OPTION_GENERATORS[target] : undefined;
  return optionsGenerator ? optionsGenerator(appContext) : {};
}
