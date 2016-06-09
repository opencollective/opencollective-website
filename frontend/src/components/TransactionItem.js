import React from 'react';
import moment from 'moment';

import ProfilePhoto from './ProfilePhoto';
import Currency from './Currency';
import ExpenseStatus from './ExpenseStatus';

export default ({transaction, user, precision=0}) => {
  const txDate = transaction.incurredAt || transaction.createdAt;

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
          {txDate && moment(txDate).fromNow()}
        </div>

        {!transaction.isDonation && <div className='TransactionItem-status'>
          <ExpenseStatus status={transaction.status} />
        </div>}
      </div>
    </div>
  );
}

function getAmount(transaction) {
  if (transaction.isDonation) {
    return transaction.amount;
  }
  return transaction.amount / 100;
}
