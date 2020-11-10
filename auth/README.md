## Auth API service (uses AWS Cognito)

This micro-service handles Authentication for "FeatureToggler" clients.

It currently covers apps and services client apps that need to fetch features from the main service and need JWT access token.

### Installation

1. Install dependencies: `npm install`

2. Run app: `npm start`

### Development

To start developing run: `npm run dev`


### Test API

After starting the app (`npm start`), run:

#### Test Authentication (Token endpoint)

```
$ curl -XPOST -H "Content-type: application/json" \
  --data '{"username": "monzo2", "password": "xxxxxxxxxxxxxx"}' \
  localhost:8080/auth/token
```

#### Test renew token using Refresh token
```
$ curl -XPOST -H "Content-type: application/json" --data '{"username": "monzo2", "refreshToken": "refresh-token-value-from-client"}' localhost:8080/auth/token
```


### Create Cognito web user

The above tests assume that the user is created in Cognito user pool. To create user there is a helper script `./scripts/create-feature-service-user.sh`:

```bash
$ ./scripts/create-feature-service-user.sh
Usage: create-feature-service-user.sh <username> <email> <phone>
```

### Create Cognito client app user

The above tests assume that the user is created in Cognito user pool. To create user there is a helper script `./scripts/create-feature-service-client-app.sh`:

```bash
$ ./scripts/create-feature-service-client-app.sh
Usage: create-feature-service-client-app.sh <username> <email> <phone>
```
