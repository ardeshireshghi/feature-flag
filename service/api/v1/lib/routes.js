import featureController from './controllers/feature_controller';

const defaultHandler = (_, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ hello: 'Feature toggle service' }));
};

const defaultController = {
  get: defaultHandler
};

export const routeToController = {
  feature: featureController,
  features: featureController,
  default: defaultController
};
