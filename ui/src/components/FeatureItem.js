import React, { useState } from 'react';
import { Card, Text, Small, Switch, majorScale } from 'evergreen-ui';
import FeatureToggleSwitchContainer from './FeatureToggleSwitchContainer';

const formattedLastUpdate = (updatedAtISODate) => {
  const updatedMinsAgo = (Date.now() - Date.parse(updatedAtISODate)) / 1000 / 60;

  if (updatedMinsAgo < 1) {
    return `${Math.round(updatedMinsAgo * 60)} seconds ago`;
  }

  if (updatedMinsAgo < 60) {
    return `${Math.floor(updatedMinsAgo)} minutes ago`;
  }

  if (updatedMinsAgo < 60 * 24) {
    return `${Math.floor(updatedMinsAgo / 60)} hours ago`;
  }

  return `${Math.floor(updatedMinsAgo / (60 * 24))} days ago`;
}


function FeatureItem({feature: { name, updatedAt, enabled }}) {
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
      <Text size={500}>
        {name}
        <Small color="#a9a9a9" display="block">Last update: {formattedLastUpdate(updatedAt)}</Small>
      </Text>
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
