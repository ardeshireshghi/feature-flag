import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import { Button } from 'evergreen-ui';
import FeatureListPage from './pages/FeatureListPage';
import ProductListPage from './pages/ProductListPage';
import Nav from './components/Nav';

import './App.css';

function AppWithRouter() {
  return (
    <div className="App">
      <Nav />
      <Router>
        <Route exact path="/">
          <ProductListPage />
        </Route>
        <Route exact path="/products">
          <ProductListPage />
        </Route>
        <Route path="/product/:name">
          <FeatureListPage />
        </Route>
      </Router>
    </div>
  );
}

export default AppWithRouter;
