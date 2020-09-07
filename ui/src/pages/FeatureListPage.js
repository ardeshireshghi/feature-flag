import React, { useState, useEffect, useCallback } from 'react';
import { Heading, PlusIcon, Pane, majorScale, useTheme } from 'evergreen-ui';
import FeaturesList from '../components/FeaturesList';
import AddCircleButton from '../components/AddCircleButton';
import CreateFeatureDialog from '../components/CreateFeatureDialog';
import { createFeature, fetchFeatures } from '../services/features-service';

function FeatureListPage() {
  const [features, setFeatures] = useState(() => []);
  const [createFeatureDialogShown, setCreateFeatureDialogShown] = useState(false);
  const theme = useTheme();

  const handleNewFeatureBtnClick = useCallback(
    e => {
      e.preventDefault();
      setCreateFeatureDialogShown(true);
    },
    [features]
  );

  const createNewFeature = useCallback(
    async newFeatureName => {
      const newFeature = await createFeature(newFeatureName);

      setFeatures(prevFeatures => ({ ...prevFeatures, [newFeatureName]: newFeature }));
      setCreateFeatureDialogShown(false);
    },
    [features]
  );

  useEffect(() => {
    const callFeaturesApi = async () => {
      const features = await fetchFeatures();
      setFeatures(features);
    };

    callFeaturesApi();
  }, []);

  return (
    <Pane flex={1} background="blueTint" padding={majorScale(2)}>
      <Pane display="flex" alignItems="center" marginTop={majorScale(2)} marginBottom={majorScale(3)}>
        <Heading size={700}>Product A: Custom feature flags</Heading>
        <AddCircleButton
          onClick={handleNewFeatureBtnClick}
          color={theme.palette.green.base}
          style={{ marginLeft: 'auto', marginRight: majorScale(1) }}
        />
        <CreateFeatureDialog
          isShown={createFeatureDialogShown}
          onClosed={() => setCreateFeatureDialogShown(false)}
          onSubmit={createNewFeature}
        />
      </Pane>
      <FeaturesList features={features}></FeaturesList>
    </Pane>
  );
}

export default FeatureListPage;
