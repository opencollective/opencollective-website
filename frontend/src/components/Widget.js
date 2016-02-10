import React from 'react';

import TransactionItem from './TransactionItem';
import UsersList from './UsersList';
import Currency from './Currency';

export default ({
  group,
  transactions,
  users,
  href
}) => {

  return (
    <div className='Widget'>
      <div className='Widget-header'>
        <img src={group.logo} />
        <h1>{group.name}</h1>
        <p>{group.description}</p>

        <div className='Widget-balance'>
          <Currency
            value={group.balance}
            currency={group.currency} />
        </div>
        <div className='Widget-label'>Available funds</div>
      </div>

      <h2>Latest transactions</h2>
      {transactions.map(t => (
        <TransactionItem
          key={t.id}
          transaction={t}
          user={users.find(({id}) => id === t.UserId)} />
      ))}

      <h2>Meet our backers</h2>
      <UsersList users={users} />
      <a href={href}>
        <div className='Button Widget-button'>
          Donate
        </div>
      </a>
    </div>
  );
}