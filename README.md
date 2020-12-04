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

Alternatively you can run each of the processes separately:

```
$ cd service && npm run watch
```

```
$ cd auth && npm run dev
```

## Run UI

```bash
$ cd ui && npm start
```

## CI/CD and Deployment

The build and deploy happens in CircleCI upon pushing to master. Each commit will be automatically deployed to `dev` stage using `serverless` when the test and build passes. The AWS credentials for the deploy IAM role are set in CircleCI config.
