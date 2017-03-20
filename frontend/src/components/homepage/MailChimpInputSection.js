import React, { Component, PropTypes } from 'react';

const EXTERNAL_JQUERY_SRC = '//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js';
const RE_EMAIL = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export default class MailChimpInputSection extends Component {

  static propTypes = {
    mcListId: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      waitingListInputValue: '',
      sending: false
    }
  }

  componentDidMount() {
    // Inject jQuery if it has not already been injected.
    if (Array.prototype.slice.call(document.head.querySelectorAll('script')).map(x => x.src).indexOf(`${location.protocol}${EXTERNAL_JQUERY_SRC}`) === -1) {
      const script = document.createElement('script')
      script.src= EXTERNAL_JQUERY_SRC;
      document.head.appendChild(script);
    }
  }

  render() {
    const { mcListId, buttonLabel } = this.props;
    const { waitingListInputValue, sending } = this.state;
    const formAction = `//opencollective.us12.list-manage.com/subscribe/post?u=88fc8f0f3b646152f1cfe447a&id=${mcListId}`;
    const isValidEmail = RE_EMAIL.test(waitingListInputValue);
    const buttonOpts = (isValidEmail && !sending) ? {} : {disabled: 'disabled'};
    return (
      <div className='MailChimpInputSection'>
        <form ref='form' action={formAction} method='GET' name="mc-embedded-subscribe-form" target="_blank" onSubmit={e => {
          e.preventDefault();
          if (isValidEmail) {
            this.onSubmit();
          }
        }}>
          <div>
            <input
              type='email'
              name='EMAIL'
              value={waitingListInputValue}
              placeholder='Email'
              className='-input'
              onChange={e => this.setState({waitingListInputValue: e.target.value})}
            />
            <input
              type='button'
              value={buttonLabel || 'Join'}
              name='subscribe'
              className={`-button ${isValidEmail ? '-valid' : '-invalid'}`}
              {...buttonOpts}
              onClick={this.onSubmit.bind(this)}
            />
          </div>
          <div className='msg'></div>
        </form>
      </div>
    )
  }

  onSubmit() {
    const { mcListId } = this.props;
    const endpoint = `//opencollective.us12.list-manage.com/subscribe/post-json?u=88fc8f0f3b646152f1cfe447a&id=${mcListId}&c=?`;
    const formElement = this.refs.form;
    const messageElement = formElement.querySelector('.msg');
    this.setState({sending: true});
    $.ajax({ // eslint-disable-line
      type: 'GET',
      url: endpoint,
      data: $(formElement).serialize(),  // eslint-disable-line
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      error: () => {
        messageElement.innerHTML = 'There was an error processing you request, please verify your email and try again.';
        this.setState({sending: false});
      },
      success: data => {
        if (data.msg) {
          messageElement.innerHTML = data.msg;
        }
        this.setState({sending: false});
      }
    });
  }
}
