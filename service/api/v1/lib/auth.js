import CognitoExpress from 'cognito-express';
import { promisify } from 'util';

const cognitoExpressForApps = new CognitoExpress({
  region: 'eu-west-1',
  cognitoUserPoolId: process.env.COGNITO_APP_POOL_ID,
  tokenUse: 'access',
  tokenExpiration: 3600000
});


const cognitoExpressForUsers = new CognitoExpress({
  region: 'eu-west-1',
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  tokenExpiration: 3600000
});

const cognitoValidateApp = promisify(cognitoExpressForApps.validate.bind(cognitoExpressForApps));
const cognitoValidateUser = promisify(cognitoExpressForUsers.validate.bind(cognitoExpressForUsers));

const validateToken = async ({ accessToken, tokenValidator }) => {
  await tokenValidator(accessToken);
};

export const authoriser = async (req, res, next) => {
  //I'm passing in the access token in header under key accessToken
  let accessTokenFromClient = req.headers.authorization ? req.headers.authorization.replace(/^Bearer /, '') : null;

  //Fail if token not present in header.
  if (!accessTokenFromClient) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: true,
        code: 'AccessTokenMissingError',
        message: 'Access Token missing from header',
        status: 401
      })
    );

    return;
  }

  let tokenValidator;

  if (req.headers['x-client-type'] && req.headers['x-client-type'] === 'web') {
    tokenValidator = cognitoValidateUser;
  } else {
    tokenValidator = cognitoValidateApp;
  }

  try {
    await validateToken({ accessToken: accessTokenFromClient, tokenValidator });
    console.log('Validated token, request authorized');
    next();
  } catch (err) {
    console.log('Error validating access token', accessTokenFromClient, err);
    const newError = new Error('Invalid or expired access token');

    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: true,
        code: newError.code,
        message: newError.message,
        status: 401
      })
    );
  }
};
