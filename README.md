# feature-toggler

Node.js MVP application for managing feature flags.


## Installation

This app depends on `Node.js >= 12`. It is also using Serverless Framework. To install:

```bash
$ ./scripts/setup
```

## Run local (using serverless offline)

To run the service (feature micro-service as well as the auth), run:

Make sure S3 buckets are configured correctly in the Serverless config file (`serverless.yml`). Also This app depends on having access to an AWS account and IAM user with full access to S3 as it uses it as data store.

```bash
$ sls offline
```

## Run UI

```bash
$ cd ui && npm start
```
