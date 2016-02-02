import React from 'react';

import Transaction from './Transaction';

export default ({transactions=[], users, isPublic}) => {

  return (
    <div>
      {transactions.map(transaction => {
        return (
          <Transaction
            key={transaction.id}
            isPublic={isPublic}
            {...transaction}
            user={users[transaction.UserId] || {}} />
        );
      })}
    </div>
  );
}
