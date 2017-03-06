import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { canEditUser } from '../lib/admin';

// components
import NotFound from '../components/NotFound';

// selectors
import { getPopulatedCollectiveSelector } from '../selectors/collectives';
import { getCurrentUserProfileSelector } from '../selectors/users';
import { getSessionSelector } from '../selectors/session';


export class Settings extends Component {
  render() {
    const {
      collective,
      profile,
      session
    } = this.props;

    if (profile && canEditUser(session, profile)) {
        // show settings page
        return (<div> Hello { profile.username } </div>);
    } else {
      // Fork here to show a collective's settings page, when that's built
      return <NotFound />
    }
  }
}

const mapStateToProps = createStructuredSelector({
  collective: getPopulatedCollectiveSelector,
  profile: getCurrentUserProfileSelector,
  session: getSessionSelector
});

export default connect(mapStateToProps , {})(Settings);