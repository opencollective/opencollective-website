import React, { Component } from 'react';
import { connect } from 'react-redux';

import values from 'lodash/values';

import ProfilePage from './ProfilePage';
import PublicGroup from './PublicGroup';
import Collective from './Collective'
import { canEditUser } from '../lib/admin';

export class PublicPage extends Component {
  render() {
    if (this.props.isUserProfile) {
      const profile = this.props.group;
      profile.canEditUser = canEditUser(this.props.session, profile)

      return <ProfilePage profile={ profile } />
    } else if (this.props.showOldCollectivePage) {
      return <PublicGroup />
    } else {
      return <Collective />
    }
  }
}

export default connect(mapStateToProps , {})(PublicPage);

export function mapStateToProps({groups, session, router}) {
  const group = values(groups)[0] || {};

  return {
    group,
    session,
    isUserProfile: Boolean(group.username),
    showOldCollectivePage: router.location.query.old === '1' || group.isSuperCollective || group.hasPaypal,
  };
}
