import React from 'react';
import { Link } from 'react-router';

import Icon from './Icon';

export default ({groupSettingsLink}) => {

  if (groupSettingsLink && groupSettingsLink.length > 0) {
    return (
      <Link className='GroupSettingsButton' to={groupSettingsLink}>
        <Icon type='gear' />
      </Link>
    );
  }
}
