import React from 'react';

const EditCollectiveOverlay = props => (
  <div className='EditCollective-Overlay' onClick={ props.onClick }>
    { props.children }
  </div>
);

export default EditCollectiveOverlay;