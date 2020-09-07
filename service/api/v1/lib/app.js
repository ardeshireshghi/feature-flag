import config from './config';

import { routeToController } from './routes';
import { parseReqBody } from './parsers/request_bodyparser';

const { apiRoutePattern } = config;

const responseError = (res, message, statusCode) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: message }));
};

const addCORSHeaders = res => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const shouldParseRequestBody = reqMethod => ['POST', 'PUT', 'DELETE'].includes(reqMethod);

const featureFlagWebApp = async (req, res) => {
  let statusCode;

  addCORSHeaders(res);

  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  try {
    let routeName = 'default';
    const uriSegmentMatch = req.url.match(apiRoutePattern);

    if (uriSegmentMatch !== null) {
      routeName = uriSegmentMatch[1];
    }

    if (!(routeName in routeToController)) {
      statusCode = 404;
      throw new Error(`Can not handle URL ${req.url}`);
    }

    const controller = routeToController[routeName];

    if (!(req.method.toLowerCase() in controller)) {
      statusCode = 405;
      throw new Error('Can not handle request as the handler for method does not exist');
    }

    if (shouldParseRequestBody(req.method)) {
      try {
        req.body = await parseReqBody(req);
      } catch (err) {
        statusCode = 422;
        throw err;
      }
    }

    console.log(`Handling request: ${req.method} ${req.url} ${req.body ? JSON.stringify(req.body) : ''}`);

    try {
      const handler = controller[req.method.toLowerCase()];
      const result = await handler(req.body);

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = req.method === 'POST' ? 201 : 200;
      res.end(JSON.stringify(result));
    } catch (err) {
      statusCode = err.status;
      throw err;
    }
  } catch (err) {
    statusCode = statusCode || 500;
    responseError(res, err.message, statusCode);
  }
};

export default featureFlagWebApp;
