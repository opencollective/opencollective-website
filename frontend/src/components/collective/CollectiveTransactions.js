import React from 'react';
import { Link } from 'react-router';
import ActivityItem from '../../components/ActivityItem';

export default class CollectiveTransactions extends React.Component {
  render() {
    const {
      users,
      collective,
      i18n,
      itemsToShow = 5
    } = this.props;

    const emptyState = (
      <div className='center'>
        <div className='Collective-emptyState-image flex items-center justify-center'>
          <img width='134' height='120'
            src='/static/images/collectives/activities-empty-state-image.jpg'
            srcSet='/static/images/collectives/activities-empty-state-image@2x.jpg 2x'/>
        </div>
        <p className='h3 -fw-bold'>{i18n.getString('activitiesPlaceholderTitle')}</p>
        <p className='h5 muted'>{i18n.getString('activitiesPlaceholderText')}</p>
      </div>
    );

    return (
      <div className='Collective-donations col col-12 mb3'>
        <div className='border-bottom border-gray pb2 mb3'>
          <h4 className='Collective-title m0 -ff-sec -fw-bold'>{i18n.getString('latestActivities')}</h4>
        </div>
        {(collective.transactions.length === 0) && emptyState}
        <div className='Collective-transactions-list'>
          {collective.transactions.slice(0, itemsToShow).map(transaction => <ActivityItem key={`pgd_${transaction.id}`} donation={transaction} user={users[transaction.UserId]} className='mb2' i18n={i18n} />)}
        </div>
        {(collective.transactions.length >= itemsToShow) && (
          <div className='center pt2'>
            <Link className='-btn -btn-medium -btn-outline -border-green -ttu -ff-sec -fw-bold' to={`/${collective.slug}/donations`}>
              {i18n.getString('seeMore')}
            </Link>
          </div>
        )}
      </div>
    );
  }
}
