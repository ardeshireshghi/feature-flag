import featureController from './controllers/feature_controller';
import productController from './controllers/product_controller';
import config from './config';

const { apiRoutePattern } = config;

const defaultHandler = (_, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ hello: 'Feature toggle service' }));
};

const defaultController = {
  get: defaultHandler
};

const routeToController = {
  feature: featureController,
  features: featureController,
  product: productController,
  products: productController,
  default: defaultController
};

export const resolveRouteController = (pathname) => {
  let routeName = 'default';
  const uriSegmentMatch = pathname.match(apiRoutePattern);

  if (uriSegmentMatch !== null) {
    routeName = uriSegmentMatch[1];
  }

  if (!(routeName in routeToController)) {
    throw new Error(`Route name ${routeName} does not match any controllers`);
  }

  return routeToController[routeName];
};
