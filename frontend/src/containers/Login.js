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
import Confirmation from '../components/Confirmation';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      showConfirmation: false,
      inProgress: false,
      disabled: false };
  }

  render() {
    return (
      <div className='Login'>
        <Notification {...this.props} />
        <LoginTopBar />
        {this.state.showConfirmation && <Confirmation><h1>Email sent!</h1><p>Click on the link provided in the email to be logged in.</p></Confirmation>}
        {!this.state.showConfirmation &&
          <div className='Login-container'>
            <div className='Login-box'>
              <div className='Login-quote'>
                <h2> Login to Open Collective </h2>
              </div>
              <LoginEmailForm onClick={sendNewToken.bind(this)} inProgress={this.state.inProgress} disabled={this.state.disabled} {...this.props} />
            </div>
          </div>
        }
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

  this.setState({inProgress: true, disabled: false});

  return sendNewLoginToken(email, redirect)
  .then(() => {
    this.setState({showConfirmation: true})
  })
  .catch(({message}) => {
    this.setState({inProgress: false, disabled: false});
    notify('error', message)
  });
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