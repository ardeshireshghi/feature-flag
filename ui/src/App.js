import React from 'react';
import { Button } from 'evergreen-ui';
import FeatureListPage from './pages/FeatureListPage';
import Nav from './components/Nav';

import './App.css';

function App() {
  return (
    <div className="App">
      <Nav />
      <FeatureListPage />
    </div>
  );
}

export default App;
