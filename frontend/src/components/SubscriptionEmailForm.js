import React, { Component } from 'react';
import Joi from 'joi';

import Input from '../components/Input';
import AsyncButton from '../components/AsyncButton';

class SubscriptionEmailForm extends Component {
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
      <div className='Subscription-Email'>
        <div className='Subscription-Email-description'>
          We will send you an email with a link to access your subscriptions.
        </div>
        <form
          className='Subscription-Email-form'>
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

  handleSubmit() {
    const {
      notify,
      onClick,
      validate
    } = this.props;

    validate(this.state.form, this.schema)
    .then(() => onClick(this.state.form.email))
    .catch(error => notify('error', error.message));
  }
}

export default SubscriptionEmailForm;