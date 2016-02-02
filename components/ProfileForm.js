import React, { Component } from 'react';

import ProfileFormDefault from './ProfileFormDefault';
import ProfileFormEdit from './ProfileFormEdit';

class ProfileForm extends Component {
  render() {
     if (this.props.isEditMode) {
      return <ProfileFormEdit {...this.props} />;
    } else {
      return <ProfileFormDefault {...this.props} />;
    }
  }
}

export default ProfileForm;