import featureController from './controllers/feature_controller';

const defaultController =  {
  get(_, res) {
    res.end('Hello! Feature toggle service');
  }
};

export const routeToController = {
  feature: featureController,
  features: featureController,
  default: defaultController
};
