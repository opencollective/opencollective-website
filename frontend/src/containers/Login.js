import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { pushState } from 'redux-router';

import PublicTopBar from '../containers/PublicTopBar';
import Notification from '../containers/Notification';

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
        <PublicTopBar />
        <Notification {...this.props} />
        <div>
          <div className='Login-logo'>
            <img src='/static/images/logo.svg' />
          </div>
          <div className='Login-quote'>
            Collect & disburse money<br />transparently
          </div>
        </div>
        <LoginEmailForm onClick={sendNewToken.bind(this)} {...this.props} />
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

function mapStateToProps({notification, router, form}) {
  return {
    notification,
    error: form.schema.error,
    redirectRoute: router.location.query.next || '/',
    token: router.params.token
  };
}