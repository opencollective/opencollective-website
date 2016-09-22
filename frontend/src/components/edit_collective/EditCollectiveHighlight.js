import React from 'react';

const EditCollectiveHighlight = ({ ref, style, label, auxClassName, buttonClassName, onClick }) => (
  <div ref={ ref } className='EditCollective-Highlight' style={ style } onClick={ onClick }>
    <div className={`Highlight-aux ${ auxClassName }`}></div>
    <div className={`EditCollective-EditButton ${ buttonClassName }`}>
      <div className='EditCollective-EditButtonLabel'>{ label }</div>
    </div>
  </div>
);

export default EditCollectiveHighlight;