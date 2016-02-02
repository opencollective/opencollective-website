import React from 'react';
import GroupLink from './GroupLink';
import TransactionsList from './TransactionsList';

export default (props) => {
  return (
    <div>
      <GroupLink {...props} />
      <TransactionsList
        transactions={props.transactions}
        users={props.users} />
    </div>
  );
}
