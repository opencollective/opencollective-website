import React from 'react';

const EditCollectiveModal = props => (
  <div className={`EditCollective-Modal ${ props.className || '' }`} onClick={e => {
    e.nativeEvent.stopImmediatePropagation();
    return false;
  }}>
    <div className='EditCollective-Modal-title'>
      <span>{ props.title }</span>
      <div className='-close' onClick={ props.onClose }>✖</div>
    </div>
    <div className='EditCollective-Modal-body'>
      { props.children }
      <div className='OnBoardingButton' onClick={ props.onDone }>Done</div>
    </div>
  </div>
);

export default EditCollectiveModal;
