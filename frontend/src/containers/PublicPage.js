import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// containers
import ProfilePage from './ProfilePage';
import Collective from './Collective'

// components
import NotFound from '../components/NotFound';

// actions
import fetchProfile from '../actions/profile/fetch_by_slug';

// libs
import { canEditUser } from '../lib/admin';

// selectors
import { getCurrentCollectiveSelector } from '../selectors/collectives';
import { getCurrentUserProfileSelector } from '../selectors/users';
import { getSessionSelector } from '../selectors/session';
import { getSlugSelector } from '../selectors/router'; 

export class PublicPage extends Component {

  componentWillMount() {
    const {
      collective,
      profile,
      slug,
      fetchProfile
    } = this.props;

    // this means it wasn't server side rendered
    if (!collective && !profile) {
      fetchProfile(slug);
    }
  }

  render() {
    const {
      collective,
      profile,
      session
    } = this.props;

    if (collective) {
      return <Collective />
    } else if (profile) {
      profile.canEditUser = canEditUser(session, profile)
      return <ProfilePage profile={ profile } />
    } else {
      return <NotFound />
    }
  }
}

const mapStateToProps = createStructuredSelector({
  collective: getCurrentCollectiveSelector,
  profile: getCurrentUserProfileSelector,
  session: getSessionSelector,
  slug: getSlugSelector
});

export default connect(mapStateToProps , {
  fetchProfile
})(PublicPage);
