import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import ProfilePage from './ProfilePage';
import Collective from './Collective'
import NotFound from '../components/NotFound';

import { canEditUser } from '../lib/admin';

import { getPopulatedCollectiveSelector } from '../selectors/collectives';
import { getCurrentUserProfileSelector } from '../selectors/users';
import { getSessionSelector } from '../selectors/session';

export class PublicPage extends Component {
  render() {
    const {
      collective,
      profile,
      session
    } = this.props;

    if (profile) {
      profile.canEditUser = canEditUser(session, profile)
      return <ProfilePage profile={ profile } />
    } else if (collective) {
      return <Collective />
    } else {
      return <NotFound />
    }
  }
}

const mapStateToProps = createStructuredSelector({
  collective: getPopulatedCollectiveSelector,
  profile: getCurrentUserProfileSelector,
  session: getSessionSelector,
});

export default connect(mapStateToProps , {})(PublicPage);
