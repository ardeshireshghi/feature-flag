import url from 'url';

import { createApp } from './app_factory';
import { resolveRouteController } from './routes';
import { parseReqBody } from './parsers/request_bodyparser';
import { parseUrl } from './parsers/url_parser';
import { responseError, addCORSHeaders } from './http/response';
import { authoriser } from './auth';

const app = createApp();

const shouldParseRequestBody = reqMethod => ['POST', 'PUT', 'DELETE'].includes(reqMethod);

const featureFlagWebAppHandler = async (req, res) => {
  let statusCode;
  let controller;

  try {
    try {
      controller = resolveRouteController(req.pathname);
    } catch(err) {
      console.error('Error resolving the route:', err);
      statusCode = 404;
      throw new Error(`Can not handle URL ${req.url}`);
    }

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

      const result = await handler(req.method === 'GET' ? req.query : { ...req.query, ...req.body });

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

app.use((req, res, next) => {
  addCORSHeaders(res);

  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  parseUrl(req);
  next();
});

app.use(authoriser);
app.use(featureFlagWebAppHandler);

export default app;
