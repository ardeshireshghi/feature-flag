import React from 'react';
import { Pane, PlusIcon, minorScale, useTheme } from 'evergreen-ui';

export default function AddCircleButton({color, ...otherProps}) {
  return (
    <a href="#" role="button" {...otherProps}>
      <Pane elevation={2} display="flex" alignItems="center" justifyContent="center" borderRadius="50%" backgroundColor={color} padding={minorScale(3)}>
        <PlusIcon size={24} color="white" />
      </Pane>
    </a>
  );
}
