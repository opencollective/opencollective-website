import React, { Component } from 'react';
import { connect } from 'react-redux';

import values from 'lodash/values';

import ProfilePage from './ProfilePage';
import PublicGroup from './PublicGroup';

export class PublicPage extends Component {
  render() {
    if (this.props.isUserProfile) {
      return <ProfilePage profile={ this.props.group } />
    } else {
      return <PublicGroup />
    }
  }
}

export default connect(mapStateToProps , {})(PublicPage);

export function mapStateToProps({groups}) {
  const group = values(groups)[0] || {};

  return {
    group,
    isUserProfile: Boolean(group.username)
  };
}
