import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';

export class Response extends Component {
  render() {
    const { params }  = this.props;
    const response = {};

    if (params.action === 'unsubscribe') {
      response.imageUrl = require('../assets/images/sad-mail.svg');
      response.title = 'Mailing subscription cancelled';
      response.description = 'Sorry for any inconvenience, feel free to subscribe again at any time.';
      response.linkUrl = '/discover';
      response.linkLabel = 'Discover new collectives';
    } else if (params.action === 'approve') {
      response.imageUrl = require('../assets/images/happy-mail.svg');
      response.title = 'Mailing subscription successful';
      response.linkUrl = '/discover';
      response.linkLabel = 'Discover new collectives';
    }

    const { imageUrl, title, description, linkUrl, linkLabel } = response;
    return (
      <div className='Response'>
        <LoginTopBar />
        <div className='Response-container'>
          <img className='image' src={imageUrl}/>
          <div className='title'>{title}</div>
          {description && <div className='description'>{description}</div>}
          <a className='green-link' href={linkUrl}>{linkLabel}</a>
        </div>
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
