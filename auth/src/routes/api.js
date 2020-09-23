const express = require('express');
const authenticationController = require('../lib/controllers/auth');

const apiRouter = express.Router();

// Authentication
apiRouter.post(/.*\/token/, authenticationController.createToken);

module.exports = apiRouter;
