import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import * as storage from '../lib/storage';
import { getQueryParams } from '../lib/utils';

import fetchUser from '../actions/users/fetch_by_id';
import logout from '../actions/session/logout';
import decodeJWT from '../actions/session/decode_jwt';

export class LoginTopBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showProfileMenu: false
    };
    this.showCreateBtn = false;
  }

  renderLinks() {
    return (
      <ul className='LoginTopBar-Links'>
        {this.showCreateBtn && <li><a className='LoginTopBarButton' href='/create'>create a collective</a></li>}
        <li><a className='LoginTopBarLink' href='/learn-more'>How it works</a></li>
        <li><a className='LoginTopBarLink' href='/discover'>Discover</a></li>
        <li><a className='LoginTopBarLink' href='https://medium.com/open-collective'>Blog</a></li>
      </ul>
    )
  }

  renderProfileMenu() {
    const { user } = this.props;

    return (
      <div className='LoginTopBarProfileMenu' onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
        <div>
          <div className='LoginTopBarProfileMenuHeading'>
            <span>collectives</span>
            <div className='-dash'></div>
          </div>
          <ul>
          {this.showCreateBtn && <li><a href='/create'>create a collective</a></li>}
          <li><a href='/discover'>Discover</a></li>
            <li><a href='/subscriptions'>Subscriptions</a></li>
          </ul>
        </div>
        <div>
          <div className='LoginTopBarProfileMenuHeading'>
            <span>my account</span>
            <div className='-dash'></div>
          </div>
          <ul>
            <li><a href={`/${user.username}`}>Profile</a></li>
          </ul>
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
    const avatar = isAuthenticated && user && user.avatar ? user.avatar : '/public/images/default_avatar.svg';
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
          {!isAuthenticated && <a className='LoginTopBarLink' href={`/signin?next=${redirectRoute || window.location.pathname}`}>Login</a>}
        </div>
      </div>
    )
  }

  componentWillMount() {
    const { isAuthenticated, user, loggedInUserId, fetchUser } = this.props;
    if (isAuthenticated && (!user || !user.stripeAccount)) {
      fetchUser(loggedInUserId);
    }
  }

  componentDidMount() {
    this.onClickOutsideRef = this.onClickOutside.bind(this);
    const urlParams = getQueryParams();
    if (urlParams.referral) {
      storage.set('referral', urlParams.referral, 48 * 60 * 60 * 1000); // we keep the referral for 48h or until we receive a new ?referral=
    }
    if (urlParams.matchingFund) {
      storage.set('matchingFund', urlParams.matchingFund, 1 * 60 * 60 * 1000); // we keep the matchingFund for 1h or until we receive a new ?matchingFund=
    }
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
