import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';

export class Faq extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchHome, loadData} = this.props;

    if (loadData) {
      fetchHome();
    }
  }

  render() {
    return (
      <div className='Faq'>
        <LoginTopBar />
        <div className='paper'>
          
        </div>
        <PublicFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(Faq);

function mapStateToProps() {
  return {
    i18n: i18n('en')
  }
}
