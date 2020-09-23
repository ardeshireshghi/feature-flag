import React from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import FeatureListPage from './pages/FeatureListPage';
import { ProductProvider } from './contexts/product-context';
import ProductListPage from './pages/ProductListPage';
import Nav from './components/Nav';
import authService from './services/auth-service';

import './App.css';

const LoginHandler = () => {
  if (!window.location.hash) {
    return <h1>Access token missing</h1>;
  }

  const authParams = Object.fromEntries(new URLSearchParams(window.location.hash).entries());

  if ('access_token' in authParams) {
    authService.setAccessToken(authParams['access_token']);

  } else {
    throw new Error('invalid access token provided by Id provider');
  }

  return <Redirect to='/' />;
};

function AppWithRouter() {
  return (
    <div className="App">
      <Nav />
      <Router>
        <Route exact path="/">
          <Redirect to="/products" />
        </Route>
        <Route exact path="/products">
          <ProductProvider>
            <ProductListPage />
          </ProductProvider>
        </Route>
        <Route path="/product/:name/features">
          <FeatureListPage />
        </Route>
        <Route path="/login-callback">
          <LoginHandler />
        </Route>
      </Router>
    </div>
  );
}

export default AppWithRouter;
