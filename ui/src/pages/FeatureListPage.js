import React, { useState, useEffect, useCallback } from 'react';
import { Heading, PlusIcon, Pane, majorScale, useTheme, FlagIcon, Text, Spinner } from 'evergreen-ui';
import { useParams } from 'react-router-dom';

import FeaturesList from '../components/FeaturesList';
import AddCircleButton from '../components/AddCircleButton';
import CreateFeatureDialog from '../components/CreateFeatureDialog';
import { createFeature, fetchFeatures } from '../services/features-service';

function FeatureListPage(props) {
  const [features, setFeatures] = useState(() => []);
  const [featuresFetched, setFeaturesFetched] = useState(false);
  const [createFeatureDialogShown, setCreateFeatureDialogShown] = useState(false);
  const theme = useTheme();
  const { name: productName } = useParams();

  const handleNewFeatureBtnClick = useCallback(
    e => {
      e.preventDefault();
      setCreateFeatureDialogShown(true);
    },
    [features]
  );

  const createNewFeature = useCallback(
    async newFeatureName => {
      const newFeature = await createFeature({ productName, name: newFeatureName });

      setFeatures(prevFeatures => ({ ...prevFeatures, [newFeatureName]: newFeature }));
      setCreateFeatureDialogShown(false);
    },
    [features]
  );

  useEffect(() => {
    const callFeaturesApi = async () => {
      const features = await fetchFeatures({ productName });
      setFeatures(features);
      setFeaturesFetched(true);
    };

    callFeaturesApi();
  }, []);

  return (
    <Pane display="flex" flexDirection="column" flex={1} background="blueTint" padding={majorScale(2)}>
      <Pane display="flex" alignItems="center" marginTop={majorScale(2)} marginBottom={majorScale(3)}>
        <Heading size={700}>{productName}: Custom feature flags</Heading>
        <AddCircleButton
          title="Create new feature flag"
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

      {!featuresFetched ? (
        <Pane flex="1" display="flex" alignItems="center" justifyContent="center">
          <Spinner />
        </Pane>
      ) : Object.keys(features).length ? (
        <FeaturesList features={features}></FeaturesList>
      ) : (
        <Pane display="flex" flexDirection="column" flexGrow="1" alignItems="center" justifyContent="center">
          <FlagIcon color={theme.palette.blue.light} transform="scale(10)" />
          <Text color={theme.scales.neutral.N5A} position="relative" top={majorScale(10)}>
            No feature flags created yet
          </Text>
        </Pane>
      )}
    </Pane>
  );
}

export default FeatureListPage;
