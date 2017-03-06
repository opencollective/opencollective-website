import React, { Component } from 'react';
import { connect } from 'react-redux';

import values from 'lodash/values';

import { canEditUser } from '../lib/admin';

export class Settings extends Component {
  render() {
    return (<div> HELLO </div>);
  }
}

export default connect(mapStateToProps , {})(Settings);

export function mapStateToProps({groups, session, router}) {
  const collective = values(groups)[0] || {};

  return {
    collective,
    session,
    isUserProfile: Boolean(collective.username),
    slug: router.params.slug,
  };
}
