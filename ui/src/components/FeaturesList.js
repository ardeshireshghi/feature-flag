import React from 'react';
import { Pane } from 'evergreen-ui';
import FeatureItem from './FeatureItem';

function FeaturesList({ features }) {
  return (
    <Pane>
      {Object.keys(features).map((featureName, index) => (
        <FeatureItem key={index} feature={features[featureName]} />
      ))}
    </Pane>
  );
}

export default FeaturesList;
