import productRepository from '../product/product_repo';

export default {
  get: productRepository.find,
  post: productRepository.create,
  delete: productRepository.delete
};
