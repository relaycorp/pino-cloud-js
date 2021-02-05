# @relaycorp/pino-cloud

This library generates [Pino](https://getpino.io) configuration to format log entries in such a way that they can be properly ingested by cloud logging services such as those on Google Cloud Platform (GCP).

At this point, only GCP's Cloud Logging and Error Reporting services are supported, but we'd welcome any PRs to support additional targets, such as Elastic Search or AWS CloudWatch Logs.

## Install

Releases are automatically pushed to [NPM](https://www.npmjs.com/package/@relaycorp/pino-cloud). For example, to get the latest release, run:

```shell
npm install @relaycorp/pino-cloud
```

## Usage

This library simply returns a configuration object for Pino, which you augment before passing to Pino. For example:

```typescript
import { getPinoOptions } from '@relaycorp/pino-cloud';

const LOGGER = pino({
  ...getPinoOptions(process.ENV.LOGGING_TARGET, {
    name: 'your-app-name',
    version: '1.0.2',
  }),
  level: 'debug',
});
```

If the environment variable `LOGGING_TARGET` is unset, an empty object is returned.

## Targets

### `gcp`

`error` and `fatal` logs are augmented to include Error Reporting fields, like the name and version of your app.

Additionally, if the log contains an `err` field that is an instance of `Error`, its stack trace will be added to the field `stack_trace` -- Where Error Reporting expects to find it.

## API documentation

The API documentation can be found on [docs.relaycorp.tech](https://docs.relaycorp.tech/pino-cloud-js/).

## Contributing

We love contributions! If you haven't contributed to a Relaycorp project before, please take a minute to [read our guidelines](https://github.com/relaycorp/.github/blob/master/CONTRIBUTING.md) first.
