import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';

export class Settings extends Component {
  render() {
    // const { params }  = this.props;
    return (
      <div className='Settings'>
        <LoginTopBar />
        <div className='Settings-container'>
        Settings
        </div>
        <PublicFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(Settings);

function mapStateToProps() {
  return {
    i18n: i18n('en')
  }
}
