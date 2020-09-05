import React, { useState, useEffect } from 'react';
import { Heading, Pane, majorScale } from 'evergreen-ui';
import FeaturesList from '../components/FeaturesList';

const featuresApiBaseUrl = process.env.REACT_APP_FEATURE_FLAG_SERVICE_BASE_URL;

function FeatureListPage() {
  const [features, setFeatures] = useState(() => []);

  useEffect(() => {
    const fetchFeatures = async () => {
      const result = await fetch(`${featuresApiBaseUrl}/api/v1/features`);
      const features = await result.json();

      setFeatures(features);
    };

    fetchFeatures();
  }, []);

  return (
    <Pane padding={majorScale(2)}>
      <Heading size={700} marginTop={majorScale(2)} marginBottom={majorScale(3)}>
        Product A: Custom feature flags
      </Heading>
      <FeaturesList features={features}></FeaturesList>
    </Pane>
  );
}

export default FeatureListPage;
