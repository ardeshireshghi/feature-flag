const TOKEN_STORAGE_KEY = 'api_access_token';
const COGNITO_CLIENT_ID = process.env.REACT_APP_COGNITO_CLIENT_ID;
const COGNITO_LOGIN_ENDPOINT = 'https://feature-flag-service.auth.eu-west-1.amazoncognito.com/login';

export default {
  getLoginUrl() {
    return `${COGNITO_LOGIN_ENDPOINT}?client_id=${COGNITO_CLIENT_ID}&response_type=token&scope=email+openid&redirect_uri=${window.location.origin}/login-callback`;
  },
  setAccessToken(token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },

  getAccessToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
};
