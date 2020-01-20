import http from 'http';
import featureController from './feature/feature_controller';
import dotEnv from 'dotenv';

dotEnv.config();

const { APP_PORT } = process.env;

const routes = {
  feature: featureController,
  features: {
    get: featureController.get
  },
  default: {
    get(_, res) {
      res.end('Welcome to Feature toggle service');
    }
  }
};

const requestHandler = async (req, res) => {
  try {
    let routeName = 'default';
    const uriSegmentMatch = req.url.match(/\/([^\/]+)\/?/)

    if (uriSegmentMatch !== null) {
      routeName = uriSegmentMatch[1];
    }

    if (!(routeName in routes)) {
      res.statusCode = 404;
      throw new Error(`Can not handle URL ${req.url}`);
    }

    const controller = routes[routeName];

    if (!(req.method.toLowerCase() in controller)) {
      res.statusCode = 404;
      throw new Error('Can not handle request as the handler for method does not exist');
    }

    res.setHeader('Content-Type', 'application/json');
    await controller[req.method.toLowerCase()](req, res);
  } catch(err) {
    res.end(err.message);
  }
};

http
  .createServer(requestHandler)
  .listen(APP_PORT, () => {
    console.log(`Listening to port ${APP_PORT}`);
  });
