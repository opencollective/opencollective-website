import React, { Component, PropTypes } from 'react';

import CollectivePendingExpenses from './CollectivePendingExpenses';
import CollectiveTransactions from './CollectiveTransactions';
import CollectiveDonate from './CollectiveDonate';
import Currency from '../Currency';

export default class CollectiveLedger extends Component {

  render(){
    const { collective, i18n, hasHost } = this.props; 
    return (
      <section id='budget' className='px2'>
        <div className='CollectiveLedger clearfix md-flex'>
          {hasHost &&
          <div className='CollectiveLedgerDonate'>
            <CollectiveDonate {...this.props } />
          </div> }
          <div className='CollectiveLedgerItems'>
            <div className='CollectiveLedgerAvailableFunds'>
              <h2 className='Collective-title m0 -ff-sec -fw-bold'>{i18n.getString('fundsAvailable')}</h2>
              <Currency value={ collective.balance/100 } currency={ collective.currency } precision={0} />
            </div>
            <CollectivePendingExpenses {...this.props} />
            <CollectiveTransactions {...this.props} />
          </div>

        </div>
      </section>
    );
  }
}

CollectiveLedger.propTypes = {
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  hasHost: PropTypes.bool.isRequired,
  users: PropTypes.object,
  donate: PropTypes.func,
};