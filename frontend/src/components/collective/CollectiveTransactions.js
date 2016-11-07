import React from 'react';
import { Link } from 'react-router';
import CollectiveActivityItem from './CollectiveActivityItem';

export default class CollectiveTransactions extends React.Component {
  render() {
    const {
      users,
      collective,
      i18n,
      itemsToShow = 10
    } = this.props;

    const emptyState = (
      <div className='center'>
        <div className='Collective-emptyState-image flex items-center justify-center'>
          <img width='134' height='120'
            src='/static/images/collectives/activities-empty-state-image.jpg'
            srcSet='/static/images/collectives/activities-empty-state-image@2x.jpg 2x'/>
        </div>
        <p className='h3 -fw-bold'>{i18n.getString('transactionsPlaceholderTitle')}</p>
        <p className='h5 muted'>{i18n.getString('transactionsPlaceholderText')}</p>
      </div>
    );

    return (
      <div className='Collective-transactions col col-12 mb3'>
        {(collective.transactions.length === 0) && emptyState}
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
