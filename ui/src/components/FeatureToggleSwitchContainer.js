import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { updateFeature } from '../services/features-service';

function FeatureToggleSwitchContainer({ name, initialEnabledState, children }) {
  const [featureIsEnabled, setFeatureEnabled] = useState(initialEnabledState);
  const { name: productName } = useParams();

  const onFeatureChanged = useCallback(async (isEnabled) => {
    setFeatureEnabled(isEnabled);
    await updateFeature({ productName, name, enabled: isEnabled });
  }, [name, productName, setFeatureEnabled]);

  return <>{children(featureIsEnabled, onFeatureChanged)}</>;
}

export default FeatureToggleSwitchContainer;
