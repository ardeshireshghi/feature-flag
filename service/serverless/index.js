// Modules
const serverless = require('serverless-http');
const featuresFlagApiApp = require('../dist/api/v1/lib/app').default.handler();
const serverlessHandler = serverless(featuresFlagApiApp);

// Handler
module.exports.handler = async (event, context) => {
  const result = await serverlessHandler(event, context);
  return result;
};
