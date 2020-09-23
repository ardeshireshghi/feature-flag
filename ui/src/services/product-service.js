import authService from './auth-service';

const FEATURES_API_BASE_URL = process.env.REACT_APP_FEATURE_FLAG_SERVICE_BASE_URL;

const headers = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authService.getAccessToken()}`,
    'x-client-type': 'web'
  }
};
const doCreateProduct = async ({ name, description }) => {
  return await fetch(`${FEATURES_API_BASE_URL}/api/v1/product`, {
    method: 'POST',
    headers: headers(),
    credentials: 'same-origin',
    body: JSON.stringify({
      name,
      description
    })
  });
};

const doDeleteProduct = async ({ name }) => {
  const url = new URL(`${FEATURES_API_BASE_URL}/api/v1/product`);
  url.searchParams.append('name', name);

  return await fetch(url, {
    method: 'DELETE',
    headers: headers(),
    credentials: 'same-origin',
    body: ''
  });
};

const doFetchProducts = async () => {
  return await fetch(`${FEATURES_API_BASE_URL}/api/v1/products`, {
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

export const fetchProducts = withErrorHandling('fetch', doFetchProducts);
export const createProduct = withErrorHandling('create', doCreateProduct);
export const deleteProduct = withErrorHandling('delete', doDeleteProduct);
