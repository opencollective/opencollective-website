import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import CollectivePendingExpenses from './CollectivePendingExpenses';
import CollectiveTransactions from './CollectiveTransactions';
import CollectiveDonate from './CollectiveDonate';
import Currency from '../Currency';

export default class CollectiveLedger extends Component {

  render(){
    const { collective, i18n, hasHost } = this.props; 
    return (
      <section id='budget' className='px2'>
        <div className='CollectiveLedger clearfix md-flex justify-center'>
          <div className='CollectiveLedger-lhs clearfix flex-column mr2 max-width-2'>
            <CollectivePendingExpenses {...this.props} /> 
            {hasHost && <CollectiveDonate {...this.props } />}  
          </div>
          <div className='CollectiveLedger-activity max-width-1'>
            <div className='CollectiveLedgerAvailableFunds clearfix border-bottom border-gray pb2 mb3 flex justify-between'>
              <h3 className='Collective-title m0 -fw-bold flex-auto'>{i18n.getString('fundsAvailable')}: </h3>
              <p className='h3 m0 -ff-sec right-align'> 
                <Currency value={ collective.balance } currency={ collective.currency } precision={0} />
              </p>
            </div>
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
};