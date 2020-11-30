const idService = require('../services/identity');

function responseFromError(err) {
  return {
    error: true,
    code: err.code,
    message: err.message,
    status: 403
  };
}

module.exports.createToken = async (req, res) => {
  const {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken
  } = req.body;

  try {
    let idResponse;

    if (!refreshToken) {
      idResponse = await idService.authenticate({ clientId, clientSecret });
    } else {
      idResponse = await idService.renew({ clientId, refreshToken });
    }

    res.json(idResponse);
  } catch (err) {
    res.status(403).json(responseFromError(err));
  }
};
