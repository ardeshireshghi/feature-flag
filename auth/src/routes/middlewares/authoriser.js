const idService = require('../../lib/services/identity');

const authoriser = async (req, res, next) => {
  //I'm passing in the access token in header under key accessToken
  let accessTokenFromClient = req.headers.authorization.replace(/^Bearer /, '');
  //Fail if token not present in header.
  if (!accessTokenFromClient) {
    res.status(401).json({
      error: true,
      code: 'AccessTokenMissingError',
      message:'Access Token missing from header',
      status: 401
    });
    return;
  }

  try {
    const user = await idService.authorize({ accessToken: accessTokenFromClient });
    res.locals.user = user;
    next();
  } catch(err) {
    res.status(401).send({
      error: true,
      code: err.code,
      message: err.message,
      status: 401
    });
  }
};

module.exports = { authoriser };
