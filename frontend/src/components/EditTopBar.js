import React, { PropTypes } from 'react';

const EditTopBar = (props) => (
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
      <div className='EditCollective-TopBar-Button' onClick={ props.onSave }>Save Changes</div>
      <div className='EditCollective-TopBar-Button trans' onClick={ props.onCancel }>Cancel</div>
    </div>
  </div>
);

export default EditTopBar;

EditTopBar.propTypes = {
  onSave: PropTypes.func,
  onCancel: PropTypes.func
}