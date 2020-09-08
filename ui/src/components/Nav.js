import React from 'react';
import { Link, Pane, majorScale, Avatar, useTheme } from 'evergreen-ui';

import './Nav.css';

export default function Nav() {
  const theme = useTheme();

  return (
    <Pane
      position="relative"
      padding={majorScale(2)}
      color="black"
      display="flex"
      alignItems="center"
      backgroundColor={theme.palette.neutral.dark}
      elevation={1}
      height={100}
    >
      <Link className="nav__logo" title="FeatureToggler" href="/">
        FeatureToggler
      </Link>

      <Avatar marginLeft="auto" isSolid name="Ardeshir Eshghi" size={40} />
    </Pane>
  );
}
