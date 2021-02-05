import { Level, LoggerOptions } from 'pino';

import { AppContext } from '../AppContext';

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
export const CLOUD_LOGGING_SEVERITY_BY_LEVEL: { readonly [key in Level]: string } = {
  debug: 'DEBUG',
  error: 'ERROR',
  fatal: 'CRITICAL',
  info: 'INFO',
  trace: 'DEBUG',
  warn: 'WARNING',
};

export default function (appContext?: AppContext): Partial<LoggerOptions> {
  if (!appContext) {
    throw new Error('GCP target requires an app context');
  }

  const errorReportingFields = {
    '@type': 'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent',
    serviceContext: {
      service: appContext.name,
      ...(appContext.version && { version: appContext.version }),
    },
  };
  return {
    formatters: {
      level(level, _number): object {
        const severity = CLOUD_LOGGING_SEVERITY_BY_LEVEL[level as Level];
        return { severity, ...(['error', 'fatal'].includes(level) && errorReportingFields) };
      },
      log(entry): object {
        const error = (entry as any).err as Error | undefined;
        return { ...entry, ...(error instanceof Error && { stack_trace: error.stack }) };
      },
    },
    messageKey: 'message',
  };
}
