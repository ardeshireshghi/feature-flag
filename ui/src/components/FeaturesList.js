import React from 'react';
import { Pane, majorScale } from 'evergreen-ui';
import FeatureItem from './FeatureItem';

function FeaturesList({ features }) {
  return (
    <Pane>
      {Object.keys(features).map((featureName, index) => (
        <FeatureItem key={index} name={featureName} enabled={features[featureName]} />
      ))}
    </Pane>
  );
}

export default FeaturesList;
