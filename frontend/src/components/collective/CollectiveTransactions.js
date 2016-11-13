import React from 'react';
import { Link } from 'react-router';

import CollectiveActivityItem from './CollectiveActivityItem';
import TransactionEmptyState from '../TransactionEmptyState';

export default class CollectiveTransactions extends React.Component {
  render() {
    const {
      users,
      collective,
      i18n,
      itemsToShow = 5
    } = this.props;

    return (
      <div className='Collective-transactions col col-12 mb3'>
        {(collective.transactions.length === 0) && 
          <TransactionEmptyState i18n={i18n} />}
        <div className='Collective-transactions-list'>
          {collective.transactions
            .slice(0, itemsToShow)
            .map(transaction => 
              <CollectiveActivityItem 
                key={`pgd_${transaction.id}`} 
                transaction={transaction} 
                user={users[transaction.UserId]} 
                className='' i18n={i18n} />)}
        </div>
        {(collective.transactions.length >= itemsToShow) && (
          <div className='center pt2'>
            <Link className='-btn -btn-medium -btn-outline -border-green -ttu -fw-bold' to={`/${collective.slug}/transactions`}>
              {i18n.getString('seeAll')} >
            </Link>
          </div>
        )}
      </div>
    );
  }
}
