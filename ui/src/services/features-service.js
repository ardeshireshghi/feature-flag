const FEATURES_API_BASE_URL = process.env.REACT_APP_FEATURE_FLAG_SERVICE_BASE_URL;

const featureApiUrlForProductName = productName => {
  const url = new URL(`${FEATURES_API_BASE_URL}/api/v1/feature`);
  url.searchParams.append('productName', productName);

  return url;
};

const doCreateFeature = async ({ name, productName }) => {
  return await fetch(featureApiUrlForProductName(productName), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify({
      name,
      enabled: false
    })
  });
};

const doUpdateFeature = async ({ name, enabled, productName }) => {
  return await fetch(featureApiUrlForProductName(productName), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify({
      name,
      enabled
    })
  });
};

const doFetchFeatures = async ({ productName }) => {
  return await fetch(featureApiUrlForProductName(productName));
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

export const fetchFeatures = withErrorHandling('fetch', doFetchFeatures);
export const createFeature = withErrorHandling('create', doCreateFeature);
export const updateFeature = withErrorHandling('create', doUpdateFeature);
