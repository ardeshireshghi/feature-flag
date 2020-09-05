const FEATURES_API_BASE_URL = process.env.REACT_APP_FEATURE_FLAG_SERVICE_BASE_URL;

const doCreateFeature = async featureName => {
  return await fetch(`${FEATURES_API_BASE_URL}/api/v1/feature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify({
      name: featureName,
      enabled: false
    })
  });
};

const doUpdateFeature = async ({ name, enabled }) => {
  return await fetch(`${FEATURES_API_BASE_URL}/api/v1/feature`, {
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

const doFetchFeatures = async () => {
  return await fetch(`${FEATURES_API_BASE_URL}/api/v1/features`);
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
