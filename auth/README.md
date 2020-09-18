## API with Cognito

This is a prototype of an API in Node JS to test how integration with Cognito works for Authentication of users.

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
  localhost:8080/api/auth/token
```

#### Test renew token using Refresh token
```
$ curl -XPOST -H "Content-type: application/json" --data '{"username": "monzo2", "refreshToken": "refresh-token-value-from-client"}' localhost:8080/api/auth/token/renew
```

#### Test protected API
```
$ curl -XPOST -H "Content-type: application/json" -H "Authorization: Bearer access-token-from-token-endpoint" localhost:8080/api/quote
```
### Create Cognito user

The above tests assume that the user is created in Cognito user pool. To create user there is a helper script `./scripts/create-user.sh`:

```bash
$ ./scripts/create-user.sh
Usage: create-user.sh <username> <email> <phone>
```
