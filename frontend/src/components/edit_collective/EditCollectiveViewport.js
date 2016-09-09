import React from 'react';

const EditCollectiveViewport = props => (
  <div className='EditCollective-Viewport'>
    { props.children }
    <div className='-screen'></div>
  </div>
);

export default EditCollectiveViewport;
