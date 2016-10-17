import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';


export class Collective extends Component {
  render() {
    return (
      <div className='Collective'>
        <LoginTopBar />
        <PublicFooter />
      </div>
    );
  }
}

export default connect(mapStateToProps, {

})(Collective);

function mapStateToProps({}) {

  return {

  };
}
