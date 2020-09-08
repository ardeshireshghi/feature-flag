import React from 'react';
import { Card, Text, Small, Switch, majorScale } from 'evergreen-ui';
import FeatureToggleSwitchContainer from './FeatureToggleSwitchContainer';
import { dateTimeAgo } from '../services/date-formatter';

function FeatureItem({ feature: { name, updatedAt, enabled } }) {
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
        <Small color="#a9a9a9" display="block">
          Last update: {dateTimeAgo(updatedAt)}
        </Small>
      </Text>
      <FeatureToggleSwitchContainer name={name} initialEnabledState={enabled}>
        {(featureIsEnabled, onFeatureChanged) => (
          <Switch
            onChange={e => onFeatureChanged(e.target.checked)}
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
