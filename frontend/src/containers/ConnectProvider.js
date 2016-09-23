import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import LoginTopBar from './LoginTopBar';

import ConnectAuthProviderButton from '../components/ConnectAuthProviderButton';
import PublicFooter from '../components/PublicFooter';

export class ConnectProvider extends Component {
  render() {
    const { params }  = this.props;
    return (
      <div className='ConnectProvider'>
        <LoginTopBar />
        <div className='ConnectProvider-container'>
          <ConnectAuthProviderButton params={params} className='Button Button--green' />
        </div>
        <PublicFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(ConnectProvider);

function mapStateToProps() {
  return {
    i18n: i18n('en')
  }
}
