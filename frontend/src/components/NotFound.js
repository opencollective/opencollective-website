import React, { Component } from 'react';

export default class NotFound extends Component {
  render() {
    return (
    <div id="content-404">
      
      <a href='https://opencollective.com/'> <img src='/public/images/LogoLargeTransparent.png' /></a>
      
      <p><b>Error 404: We can't find that page.</b></p>
      
      <p>Try our <a href='https://opencollective.com/'>homepage</a>, <a href='https://opencollective.com/faq'>FAQ</a> or <a href='https://medium.com/open-collective'>blog</a>. </p>
      
      <p>Or chat with us on our <a href='https://slack.opencollective.com/'>Slack channel</a>.</p>

      <img src='/public/images/404.gif' />

    </div>
    );
  }
}