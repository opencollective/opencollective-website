import React, { Component } from 'react';

import { connect } from 'react-redux';

import PublicTopBar from '../components/PublicTopBar';
import PublicFooter from '../components/PublicFooter';

import logout from '../actions/session/logout';

export class Subscriptions extends Component {
  render() {
    return (
      <div className='PublicGroup'>

        <PublicTopBar session={this.props.session} logout={this.props.logout}/>

        <div className='PublicContent'>
          Insert content here
        </div>
        <PublicFooter />
      </div>
    );
  }

  componentWillMount() {

  }
}

export default connect(mapStateToProps, {
  logout
})(Subscriptions);

function mapStateToProps({
  session
}) {
  return {
    session
  };
}
