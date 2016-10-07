import React from 'react';
import moment from 'moment';

import ProfilePhoto from './ProfilePhoto';
import Currency from './Currency';

export default ({transaction, user, precision=0}) => {

  return (
    <div className='TransactionItem'>
      <ProfilePhoto
        hasBorder={true}
        url={user && user.avatar} />

      <div className='TransactionItem-info'>
        <div className='TransactionItem-amount'>
          <Currency value={getAmount(transaction)} currency={transaction.currency} precision={precision}/>
        </div>
        <div className='TransactionItem-description'>
          {transaction.title || transaction.description}
        </div>

        <div className='TransactionItem-created'>
          {transaction.createdAt && moment(transaction.createdAt).fromNow()}
        </div>

      </div>
    </div>
  );
}

function getAmount(transaction) {
  return transaction.amount;
}
