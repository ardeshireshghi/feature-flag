import authService from './auth-service';

const FEATURES_API_BASE_URL = process.env.REACT_APP_FEATURE_FLAG_SERVICE_BASE_URL;

const featureApiUrlForProductName = (productName, action) => {
  const url = new URL(`${FEATURES_API_BASE_URL}/api/v1/${action === 'fetch' ? 'features' : 'feature'}`);
  url.searchParams.append('productName', productName);

  return url;
};

const headers = () => {
  return {
    'Authorization': `Bearer ${authService.getAccessToken()}`,
    'Content-Type': 'application/json',
    'x-client-type': 'web'
  };
};

const doCreateFeature = async ({ name, productName }) => {
  return await fetch(featureApiUrlForProductName(productName, 'create'), {
    method: 'POST',
    headers: headers(),
    credentials: 'same-origin',
    body: JSON.stringify({
      name,
      enabled: false
    })
  });
};

const doUpdateFeature = async ({ name, enabled, productName }) => {
  return await fetch(featureApiUrlForProductName(productName, 'update'), {
    method: 'PUT',
    headers: headers(),
    credentials: 'same-origin',
    body: JSON.stringify({
      name,
      enabled
    })
  });
};

const doFetchFeatures = async ({ productName }) => {
  return await fetch(featureApiUrlForProductName(productName, 'fetch'), {
    credentials: 'same-origin',
    method: 'GET',
    headers: headers()
  });
};

const withErrorHandling = (actionType, featureRequestFn) => {
  return async (...thisArgs) => {
    try {
      const response = await featureRequestFn(...thisArgs);

      if (!response.ok) {
        const error = new Error(`Feature flag API error, response status: ${response.status}`);
        error.status = response.status;

        throw error;
      }

      return await response.json();
    } catch (err) {
      console.error(`Error ${actionType} feature`, err, thisArgs);

      // Check for Authorization error
      if (err.status === 401) {
        window.location.assign(authService.getLoginUrl());
        return;
      }

      throw err;
    }
  };
};

export const fetchFeatures = withErrorHandling('fetch', doFetchFeatures);
export const createFeature = withErrorHandling('create', doCreateFeature);
export const updateFeature = withErrorHandling('create', doUpdateFeature);
