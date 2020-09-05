import React, { useState } from 'react';
import { Card, Text, Switch, majorScale } from 'evergreen-ui';
import FeatureToggleSwitchContainer from './FeatureToggleSwitchContainer';

function FeatureItem({ name, enabled }) {
  return (
    <Card
      padding={majorScale(2)}
      background="white"
      marginTop={majorScale(2)}
      paddingBottom={majorScale(2)}
      border="default"
      borderColor="#f0f0f0"
      display="flex"
    >
      <Text size={500}>{name}</Text>
      <FeatureToggleSwitchContainer name={name} initialEnabledState={enabled}>
        {(featureIsEnabled, setFeatureEnabled) => (
          <Switch
            onChange={e => setFeatureEnabled(e.target.checked)}
            height={24}
            marginLeft="auto"
            checked={featureIsEnabled}
          />
        )}
      </FeatureToggleSwitchContainer>
    </Card>
  );
}

export default FeatureItem;
