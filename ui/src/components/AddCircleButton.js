import React, { useState } from 'react';
import { Pane, PlusIcon, minorScale, useTheme } from 'evergreen-ui';

export default function AddCircleButton({color, ...otherProps}) {
  const [ isHovered, setHovered ] = useState(false);

  return (
    <a href="#" role="button" {...otherProps}>
      <Pane
        elevation={isHovered ? 2 : 1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        backgroundColor={color}
        padding={minorScale(3)}
        transition="all 0.25s ease"
        transform={!isHovered ? 'scale(1)' : 'scale(1.08)'}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        >
        <PlusIcon size={24} color="white" />
      </Pane>
    </a>
  );
}
