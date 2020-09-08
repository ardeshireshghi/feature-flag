import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import FeatureItem from './FeatureItem';
import { updateFeature } from '../services/features-service';

function FeatureToggleSwitchContainer({ name, initialEnabledState, children }) {
  const [featureIsEnabled, setFeatureEnabled] = useState(initialEnabledState);
  const { name: productName } = useParams();
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      const persistWithFeaturesApi = async () => {
        await updateFeature({ productName, name, enabled: featureIsEnabled });
      };

      persistWithFeaturesApi();
    } else {
      didMountRef.current = true;
    }
  }, [name, featureIsEnabled]);

  return <>{children(featureIsEnabled, setFeatureEnabled)}</>;
}

export default FeatureToggleSwitchContainer;
