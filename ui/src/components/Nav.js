import React from 'react';
import { Pane, Heading, majorScale, Avatar } from 'evergreen-ui';

import './Nav.css';

export default function Nav() {
  return (
    <Pane padding={majorScale(2)} color="black" display="flex" alignItems="center" elevation={1} height={100}>
      <div className="nav__logo">FeatureToggler</div>
      <Avatar marginLeft="auto" isSolid name="Ardeshir Eshghi" size={40} />
    </Pane>
  );
}
