import { Level } from 'pino';

import {
  APP_CONTEXT_WITH_VERSION,
  APP_CONTEXT_WITHOUT_VERSION,
  LevelFormatter,
  LogFormatter,
} from './_test_utils';
import gcpOptionGenerator, { CLOUD_LOGGING_SEVERITY_BY_LEVEL } from './gcp';

const GCP_OPTIONS = gcpOptionGenerator(APP_CONTEXT_WITHOUT_VERSION);

test('Requesting GCP options without an app context should be refused', () => {
  expect(gcpOptionGenerator).toThrowWithMessage(Error, 'GCP target requires an app context');
});

test('Message key should be "message"', () => {
  expect(GCP_OPTIONS).toHaveProperty('messageKey', 'message');
});

describe('formatters', () => {
  describe('level', () => {
    const levelFormatter: LevelFormatter = GCP_OPTIONS.formatters!.level!;

    test.each(Object.entries(CLOUD_LOGGING_SEVERITY_BY_LEVEL))(
      'Level %s should map to %s severity',
      (level) => {
        const entry = levelFormatter(level, 0);

        const expectedSeverity = CLOUD_LOGGING_SEVERITY_BY_LEVEL[level as Level];
        expect(entry).toHaveProperty('severity', expectedSeverity);
      },
    );

    test.each(['error', 'fatal'])(
      'Cloud Error Reporting fields should be added to %s logs',
      (level) => {
        const entry = levelFormatter(level, 0);

        expect(entry).toHaveProperty(
          '@type',
          'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent',
        );
        expect(entry).toHaveProperty('serviceContext.service', APP_CONTEXT_WITHOUT_VERSION.name);
        expect(entry).not.toHaveProperty('serviceContext.version');
      },
    );

    test('App version should be added to Cloud Error Reporting if set', () => {
      const levelFormatterWithVersion: LevelFormatter =
        gcpOptionGenerator(APP_CONTEXT_WITH_VERSION).formatters!!.level!!;
      const entry = levelFormatterWithVersion('error', 0);

      expect(entry).toHaveProperty('serviceContext.version', APP_CONTEXT_WITH_VERSION.version);
    });

    test.each(['debug', 'info', 'warn'])(
      'Cloud Error Reporting fields should not be added to %s logs',
      (level) => {
        const entry = levelFormatter(level, 0);

        expect(entry).not.toHaveProperty('@type');
        expect(entry).not.toHaveProperty('serviceContext');
      },
    );
  });

  describe('log', () => {
    const logFormatter: LogFormatter = GCP_OPTIONS.formatters!.log!;

    test('Stack trace should be added to log entry if present', () => {
      const err = new Error('Whoops');
      const originalLogEntry = { err, msg: 'Something went awry' };

      const logEntry = logFormatter(originalLogEntry);

      expect(logEntry).toHaveProperty('stack_trace', err.stack);
    });

    test('Stack trace should not be added to log entry if err field is not an error', () => {
      const originalLogEntry = { err: 'Not an Error instance', msg: 'Just wanted to say hi' };

      const logEntry = logFormatter(originalLogEntry);

      expect(logEntry).not.toHaveProperty('stack_trace');
    });

    test('Stack trace should not be added to log entry if error is absent', () => {
      const originalLogEntry = { msg: 'Just wanted to say hi' };

      const logEntry = logFormatter(originalLogEntry);

      expect(logEntry).not.toHaveProperty('stack_trace');
    });
  });
});
