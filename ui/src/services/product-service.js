const FEATURES_API_BASE_URL = process.env.REACT_APP_FEATURE_FLAG_SERVICE_BASE_URL;

const doCreateProduct = async ({ name, description}) => {
  return await fetch(`${FEATURES_API_BASE_URL}/api/v1/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify({
      name,
      description
    })
  });
};

const doFetchProducts = async () => {
  return await fetch(`${FEATURES_API_BASE_URL}/api/v1/products`);
};

const withErrorHandling = (actionType, featureRequestFn) => {
  return async (...thisArgs) => {
    try {
      const response = await featureRequestFn(...thisArgs);

      if (!response.ok) {
        throw new Error(`Feature flag API error, response status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error(`Error ${actionType} feature`, err, thisArgs);
      throw err;
    }
  };
};

export const fetchProducts = withErrorHandling('fetch', doFetchProducts);
export const createProduct = withErrorHandling('create', doCreateProduct);
