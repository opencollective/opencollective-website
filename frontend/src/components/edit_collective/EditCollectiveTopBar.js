import React from 'react';

const EditCollectiveTopBar = (props) => (
  <div className='EditCollective-TopBar'>
    <div className='EditCollective-TopBar-brand'>
      <svg width='18px' height='18px' className='-light-blue align-middle mr1'>
        <use xlinkHref='#svg-isotype'/>
      </svg>
      <svg width='172px' height='30px' className='align-middle -logo-text'>
        <use xlinkHref='#svg-logotype' fill='#fff' />
      </svg>
    </div>
    <div className='EditCollective-TopBar-buttons'>
      <div className={`EditCollective-TopBar-Button ${ !props.canPublish ? '-disabled' : '' }`} onClick={ props.onPublish }>Save Changes</div>
      <a href='.'><div className='EditCollective-TopBar-Button trans'>Exit Edit Mode</div></a>
    </div>
  </div>
);

export default EditCollectiveTopBar;
