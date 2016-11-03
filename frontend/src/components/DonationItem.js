import React from 'react';
import moment from 'moment';

import ProfilePhoto from './ProfilePhoto';
import Currency from './Currency';

export default ({donation, user, precision=0}) => {

  return (
    <div className='TransactionItem'>
      <ProfilePhoto
        hasBorder={true}
        url={user && user.avatar} />

      <div className='TransactionItem-info'>
        <div className='TransactionItem-amount'>
          <Currency value={getAmount(donation)} currency={donation.currency} precision={precision}/>
        </div>
        <div className='TransactionItem-description'>
          {donation.title || donation.description}
        </div>

        <div className='TransactionItem-created'>
          {donation.createdAt && moment(donation.createdAt).fromNow()}
        </div>

      </div>
    </div>
  );
}

function getAmount(donation) {
  return donation.amount * 100;
}
