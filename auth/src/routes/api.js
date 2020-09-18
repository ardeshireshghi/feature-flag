const express = require('express');
const authenticationController = require('../lib/controllers/auth');

const apiRouter = express.Router();

// Authentication
apiRouter.post('/auth/token', authenticationController.createToken);

module.exports = apiRouter;
