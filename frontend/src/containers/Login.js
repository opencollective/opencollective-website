import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import Notification from '../containers/Notification';
import LoginTopBar from '../containers/LoginTopBar';

import PublicFooter from '../components/PublicFooter';
import LoginEmailForm from '../components/LoginEmailForm';

import sendNewLoginToken from '../actions/users/send_new_login_token';
import notify from '../actions/notification/notify';
import resetNotifications from '../actions/notification/reset';
import storeToken from '../actions/session/store_token';
import decodeJWT from '../actions/session/decode_jwt';

import validate from '../actions/form/validate_schema';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='Login'>
        <Notification {...this.props} />
        <LoginTopBar />
        <div className='Login-container'>
          <div className='Login-box'>
            <div className='Login-quote'>
              <h2> Login to Open Collective </h2>
            </div>
            <LoginEmailForm onClick={sendNewToken.bind(this)} {...this.props} />
          </div>
        </div>
        <PublicFooter/>
      </div>
    );
  }

  componentWillMount() {
    const {
      token,
      pushState,
      storeToken,
      decodeJWT,
      redirectRoute
    } = this.props;

    if (token) {
      storeToken(token);
      decodeJWT();
      pushState(null, `${redirectRoute}`);
    }
  }
}

export function sendNewToken(email, redirect) {
  const {
    sendNewLoginToken,
    notify
  } = this.props;

  return sendNewLoginToken(email, redirect)
  .then(() => notify('success', 'Email sent'))
  .catch(({message}) => notify('error', message));
}

export default connect(mapStateToProps, {
  notify,
  validate,
  resetNotifications,
  sendNewLoginToken,
  pushState,
  storeToken,
  decodeJWT
})(Login);

export function mapStateToProps({notification, router, form}) {
  return {
    notification,
    error: form.schema.error,
    redirectRoute: router.location.query.next || '/',
    token: router.params.token,
  };
}