import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import fetchUser from '../actions/users/fetch_by_id';
import logout from '../actions/session/logout';
import decodeJWT from '../actions/session/decode_jwt';

export default class LoginTopBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showProfileMenu: false
    };
  }

  renderLinks() {
    return (
      <ul className='LoginTopBar-Links'>
        <li><a className='LoginTopBarButton' href='/#apply'>start a collective</a></li>
        <li><a className='LoginTopBarLink' href='/#howitworks'>How it works</a></li>
        <li><a className='LoginTopBarLink' href='/#opensource'>Discover</a></li>
      </ul>
    )
  }

  renderProfileMenu() {

    return (
      <div className='LoginTopBarProfileMenu' onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
        <div>
          {this.renderLinks()}
          <div className='LoginTopBarProfileMenuHeading'>
            <span>collectives</span>
            <div className='-dash'></div>
          </div>
          <ul>
            <li><a href='#' onClick={this.onClickSubscriptions.bind(this)}>Subscriptions</a></li>
            <li><a href='https://app.opencollective.com/'>App</a></li>
          </ul>
        </div>
        <div>
          <div className='LoginTopBarProfileMenuHeading'>
            <span>my account</span>
            <div className='-dash'></div>
          </div>
          <ul>
            <li><a className='-blue' href='#' onClick={this.onClickLogout.bind(this)}>Logout</a></li>
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const { user, isAuthenticated, redirectRoute, pushState } = this.props;
    const { showProfileMenu } = this.state;
    const avatar = isAuthenticated && user && user.avatar ? user.avatar : '/static/images/default_avatar.svg';
    const name = isAuthenticated && user && user.name ? user.name : null;
    const email = isAuthenticated && user && user.email ? user.email : null;

    return (
      <div className='LoginTopBar'>
        <a>
          <div className='LoginTopBar-logo' onClick={() => pushState(null, '/')}></div>
        </a>
        <div className='LoginTopBar-nav'>
          {this.renderLinks()}
          <div className='LoginTopBarSeperator'></div>
          {isAuthenticated &&
            <div className={`LoginTopBarProfileButton ${showProfileMenu ? '-active' : ''}`} onClick={this.toggleProfileMenu.bind(this)}>
              {avatar && <div className='LoginTopBarProfileButton-avatar' style={{backgroundImage: `url(${avatar})`}}></div>}
              {(name || email) && <div className='LoginTopBarProfileButton-name'>{name || email}</div>}
              <div className='LoginTopBarProfileButton-caret'></div>
              {showProfileMenu && this.renderProfileMenu()}
            </div>
          }
          {!isAuthenticated && <a className='LoginTopBarLink' href={`/login?next=${redirectRoute || window.location.pathname}`}>Login</a>}
        </div>
      </div>
    )
  }

  componentWillMount() {
    const { isAuthenticated, user, loggedInUserId, fetchUser } = this.props;
    if (isAuthenticated && !user) {
      fetchUser(loggedInUserId);
    }
  }

  componentDidMount() {
    this.onClickOutsideRef = this.onClickOutside.bind(this);
    document.addEventListener('click', this.onClickOutsideRef);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutsideRef);
  }

  onClickOutside() {
    this.setState({showProfileMenu: false});
  }

  toggleProfileMenu(e) {
    if (e.target.className.indexOf('LoginTopBarProfileButton') !== -1) {
      this.setState({showProfileMenu: !this.state.showProfileMenu});
      e.nativeEvent.stopImmediatePropagation();
    }
  }

  onClickLogout(e) {
    this.props.logout();
    this.props.decodeJWT();
    this.toggleProfileMenu(e);
  }

  onClickSubscriptions(e) {
    this.props.pushState(null, '/subscriptions')
    this.toggleProfileMenu(e);
  }
}


export default connect(mapStateToProps, {
  fetchUser,
  logout,
  pushState,
  decodeJWT
})(LoginTopBar);

export function mapStateToProps({session, users}){
  return {
    isAuthenticated: session.isAuthenticated,
    loggedInUserId: session.user.id,
    user: session.isAuthenticated ? users[session.user.id] : null
  };
}
