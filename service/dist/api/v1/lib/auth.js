"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authoriser = void 0;

var _cognitoExpress = _interopRequireDefault(require("cognito-express"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cognitoExpressForApps = new _cognitoExpress.default({
  region: 'eu-west-1',
  cognitoUserPoolId: process.env.COGNITO_APP_POOL_ID,
  tokenUse: 'access',
  tokenExpiration: 3600000
});
const cognitoExpressForUsers = new _cognitoExpress.default({
  region: 'eu-west-1',
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  tokenExpiration: 3600000
});
const cognitoValidateApp = (0, _util.promisify)(cognitoExpressForApps.validate.bind(cognitoExpressForApps));
const cognitoValidateUser = (0, _util.promisify)(cognitoExpressForUsers.validate.bind(cognitoExpressForUsers));

const validateToken = async ({
  accessToken,
  tokenValidator
}) => {
  try {
    const response = await tokenValidator(accessToken);
    return response;
  } catch (err) {
    console.log('Error validating access token', accessToken, err);
    const newError = new Error('Invalid or expired access token');
    newError.code = err.code;
    throw newError;
  }
};

const authoriser = async (req, res, next) => {
  //I'm passing in the access token in header under key accessToken
  let accessTokenFromClient = req.headers.authorization ? req.headers.authorization.replace(/^Bearer /, '') : null; //Fail if token not present in header.

  if (!accessTokenFromClient) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: true,
      code: 'AccessTokenMissingError',
      message: 'Access Token missing from header',
      status: 401
    }));
    return;
  }

  let tokenValidator;

  if (req.headers['x-client-type'] && req.headers['x-client-type'] === 'web') {
    tokenValidator = cognitoValidateUser;
  } else {
    console.log('GETS TO APP VALIDATOR');
    tokenValidator = cognitoValidateApp;
  }

  try {
    await validateToken({
      accessToken: accessTokenFromClient,
      tokenValidator
    });
    next();
  } catch (err) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: true,
      code: err.code,
      message: err.message,
      status: 401
    }));
  }
};

exports.authoriser = authoriser;