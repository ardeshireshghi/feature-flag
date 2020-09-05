import React, { useState, useEffect } from 'react';
import FeatureItem from './FeatureItem';

const FEATURES_API_BASE_URL = process.env.REACT_APP_FEATURE_FLAG_SERVICE_BASE_URL;

function FeatureToggleSwitchContainer({ name, initialEnabledState, children }) {
  const [featureIsEnabled, setFeatureEnabled] = useState(initialEnabledState);

  useEffect(() => {
    const updateFeature = async () => {
      try {
        const response = await fetch(`${FEATURES_API_BASE_URL}/api/v1/feature`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            name,
            enabled: featureIsEnabled
          })
        });
        if (!response.ok) {
          throw new Error(`Error updating feature name ${name}, response status: ${response.status}`);
        }
      } catch (err) {
        console.error('Error updating feature', err);
      }
    };

    updateFeature();
  }, [name, featureIsEnabled]);

  return <>{children(featureIsEnabled, setFeatureEnabled)}</>;
}

export default FeatureToggleSwitchContainer;
