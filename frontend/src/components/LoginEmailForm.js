import React, { Component } from 'react';
import Joi from 'joi';

import Input from '../components/Input';
import AsyncButton from '../components/AsyncButton';

class LoginEmailForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        email: ''
      }
    };
    this.schema = Joi.object().keys({
      email: Joi.string().email().required()
    });
  }
  render() {
    const {
      inProgress
    } = this.props;
    return (
      <div className='Login-Email'>
        <div className='Login-Email-description'>
          We will send you an email with a link to log you into Open Collective. No need to remember another password.
        </div>
        <form
          className='Login-Email-form'
          onSubmit={this.handleSubmit.bind(this)}>
          <Input
            type='email'
            placeholder='email@example.com'
            value={this.state.form.email}
            handleChange={this.handleChange.bind(this)} />
          <AsyncButton
            color='green'
            inProgress={inProgress}
            onClick={this.handleSubmit.bind(this)}>
            Send email
          </AsyncButton>
        </form>
      </div>
    );
  }

  handleChange(email) {
    this.setState({form: {email} });
  }

  handleSubmit(event) {
    const {
      notify,
      onClick,
      validate,
      redirectRoute
    } = this.props;

    event.preventDefault();

    console.log("Inside handleSubmit");

    validate(this.state.form, this.schema)
    .then(() => onClick(this.state.form.email, redirectRoute))
    .catch(error => notify('error', error.message));
  }
}

export default LoginEmailForm;