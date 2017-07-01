import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import CollectivePendingExpenses from './CollectivePendingExpenses';
import CollectiveTransactions from './CollectiveTransactions';
import Currency from '../Currency';

export default class CollectiveLedger extends Component {

  render(){
    const { collective, i18n } = this.props; 
    return (
      <section id='budget' className='px2'>
        <div className='CollectiveLedger clearfix md-flex justify-center'>
          <div className='CollectiveLedger-lhs clearfix flex-column mr3 max-width-2'>
            <CollectivePendingExpenses {...this.props} /> 
          </div>
          <div className='CollectiveLedger-activity max-width-1 ml3'>
            <div className='CollectiveLedgerAvailableFunds clearfix border-bottom border-gray pb1 mb1 flex justify-between'>
              <h3 className='m0 -fw-bold flex-auto'>{i18n.getString('fundsAvailable')}: </h3>
              <p className='h3 m0 -ff-sec right-align'> 
                <Currency value={ collective.balance } currency={ collective.currency } precision={ 2 } />
              </p>
            </div>
            <CollectiveTransactions {...this.props} transactions={ collective.transactions }/>
            <div className='center pt2'>
              {(collective.transactions.length === 0) && (
                <a className='-btn -btn-medium -btn-outline -border-green -ttu -fw-bold' href={`/${collective.slug}/transactions`}>
                  {i18n.getString('seeAllTransactions')} >
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

CollectiveLedger.propTypes = {
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
};