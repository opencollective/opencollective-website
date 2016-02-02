import React from 'react';
import ImageUpload from './ImageUpload';
import ProfilePhoto from './ProfilePhoto';

export default (props) => {
  const states = {
    template: () => <ProfilePhoto url={props.value} size='110px' />,
    uploading: () => <ProfilePhoto url={props.value} size='110px' spinner='yes'/>
  };

  return <ImageUpload {...props} {...states} customClassName='ProfilePhotoUpload'/>;
};
