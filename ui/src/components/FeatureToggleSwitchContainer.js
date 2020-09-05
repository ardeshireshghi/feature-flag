import React, { useState, useEffect, useRef } from 'react';
import FeatureItem from './FeatureItem';
import { updateFeature } from '../services/features-service';

function FeatureToggleSwitchContainer({ name, initialEnabledState, children }) {
  const [featureIsEnabled, setFeatureEnabled] = useState(initialEnabledState);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      const persistWithFeaturesApi = async () => {
        await updateFeature({ name, enabled: featureIsEnabled });
      };

      persistWithFeaturesApi();
    } else {
      didMountRef.current = true;
    }
  }, [name, featureIsEnabled]);

  return <>{children(featureIsEnabled, setFeatureEnabled)}</>;
}

export default FeatureToggleSwitchContainer;
