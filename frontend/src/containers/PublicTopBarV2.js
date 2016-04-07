import React, { Component } from 'react';
import { connect } from 'react-redux';
import logout from '../actions/session/logout';

class PublicTopBarV2 extends Component {
  showSession() {
    const {
      session,
      logout,
      loginRedirectTo = '/'
    } = this.props;

    const redirect = loginRedirectTo;

    if (session && session.isAuthenticated) {
      return (
        <div className='inline-block ml1'>
          <span className="h6">
            <span>Logged in as </span>
            <span className='-fw-bold'>{session.user.username}</span>
          </span>
          <button onClick={logout} className='border-none -btn -btn-medium -ttu -ff-sec -fw-bold'>logout</button>
        </div>
      );
    }

    return (<a className='ml1 -btn -btn-medium -ttu -ff-sec -fw-bold' href={`https://app.opencollective.com/login?next=${redirect}`}>Log in</a>);
  }

  render() {
    const { className = '' } = this.props;

    return (
      <div className={`clearfix ${className}`}>
        <div className='left'>
          <svg width='17' height='18' className='-light-blue align-middle mr1'>
            <use xlinkHref='#svg-isotype'/>
          </svg>
          <svg width='172' height='25' className='align-middle xs-hide'>
            <use xlinkHref='#svg-logotype' fill='#fff'/>
          </svg>
        </div>
        <div className='right'>
          <a className='mx1 -btn -btn-outline -btn-small px2 -ttu -ff-sec -fw-bold' href="https://opencollective.com#apply">Start a Collective!</a>
          {this.showSession()}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, {
  logout
})(PublicTopBarV2);

export function mapStateToProps({ session }) {
  return { session };
}
