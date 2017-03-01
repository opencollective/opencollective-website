import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';
import Confirmation from '../components/Confirmation';

export class Response extends Component {
  render() {
    const response = {};

    if (this.props.route.action === 'unsubscribe') {
      response.imageUrl = '/public/images/sad-mail.svg';
      response.title = 'Mailing subscription cancelled';
      response.description = 'Sorry for any inconvenience, feel free to subscribe again at any time.';
      response.linkUrl = '/discover';
      response.linkLabel = 'Discover new collectives';
    } else if (this.props.route.action === 'approve') {
      response.imageUrl = '/public/images/happy-mail.svg';
      response.title = 'Mailing subscription successful';
      response.linkUrl = '/discover';
      response.linkLabel = 'Discover new collectives';
    }

    const { imageUrl, title, description, linkUrl, linkLabel } = response;
    return (
      <div className='Response'>
        <LoginTopBar />
        <Confirmation image={imageUrl} link={linkLabel} href={linkUrl}>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </Confirmation>
        <PublicFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(Response);

function mapStateToProps() {
  return {
    i18n: i18n('en')
  }
}
