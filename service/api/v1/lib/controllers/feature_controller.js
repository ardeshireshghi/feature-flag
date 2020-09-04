import featureRepository from '../feature/feature_repo';

export default {
  get: featureRepository.find,
  post: featureRepository.create,
  put: featureRepository.update,
  delete: featureRepository.delete
};
