import React from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';

import { Button } from 'evergreen-ui';
import FeatureListPage from './pages/FeatureListPage';
import { ProductProvider } from './contexts/product-context';
import ProductListPage from './pages/ProductListPage';
import Nav from './components/Nav';

import './App.css';

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
        <Route path="/product/:name">
          <FeatureListPage />
        </Route>
      </Router>
    </div>
  );
}

export default AppWithRouter;
