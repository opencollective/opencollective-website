import React from 'react';
import { Link } from 'react-router';

import Icon from './Icon';

export default ({backLink}) => {

  if (backLink && backLink.length > 0) {
    return (
      <Link className='BackButton' to={backLink}>
        <Icon type='left' />
      </Link>
    );
  } else {
    return (
      <span className='BackButton' onClick={() => window.history.back()}>
        <Icon type='left' />
      </span>
    );
  }
}
