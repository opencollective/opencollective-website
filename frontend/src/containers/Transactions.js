import React, { Component } from 'react';

import { connect } from 'react-redux';
import values from 'lodash/object/values';

import PublicTopBar from '../components/PublicTopBar';
import PublicFooter from '../components/PublicFooter';
import Currency from '../components/Currency';

import logout from '../actions/session/logout';

export class Transactions extends Component {
  render() {
    const {
      group
    } = this.props;

    return (
     <div className='Transactions'>

        <PublicTopBar session={this.props.session} logout={this.props.logout}/>

        <div className='PublicContent'>
          <div className='Widget-header'>
            <img src={group.logo} />
            <h1>{group.name}</h1>
            <p>{group.description}</p>

            <div className='Widget-balance'>
              <Currency
                value={group.balance}
                currency={group.currency} />
            </div>
            <div className='Widget-label'>Available funds</div>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  componentWillMount() {

  }
}

export default connect(mapStateToProps, {
  logout
})(Transactions);

function mapStateToProps({
  session,
  groups
}) {
  const group = values(groups)[0] || {}; // to refactor to allow only one group

  return {
    session,
    group
  };
}
