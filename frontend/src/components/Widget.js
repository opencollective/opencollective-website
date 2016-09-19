import React from 'react';
import i18n from '../lib/i18n' // eslint-disable-line
import TransactionItem from './TransactionItem';
import UsersList from './UsersList';
import Currency from './Currency';

import '../css/widget.css'

/**
 * When the server renders the widget it passes in the i18n reference
 * as a string type. We convert it to the i18n object we expect.
 */
const normalize = (props = {}) => {
  if (typeof props.i18n === 'string') {
    props.i18n = i18n(props.i18n)
  }

  return props
}

export default (props = {}) => {
  const { options, group, transactions, users, i18n, href } = normalize(props)

  return (
    <div className='Widget'>
      {options.header && (
        <div className='Widget-header'>
          <img src={group.logo} />
          <h1>{group.name}</h1>
          <p>{group.description}</p>

          <div className='Widget-balance'>
            <Currency
              value={group.balance}
              currency={group.currency} />
          </div>
          <div className='Widget-label'>Funds Raised</div>
        </div>
      )}

      {options.transactions && (
        <h2>Latest transactions</h2>
      )}
      {options.transactions && transactions.map(t => (
        <TransactionItem
          key={t.id}
          transaction={t}
          i18n={i18n}
          user={users.find(({id}) => id === t.UserId)} />
      ))}

      {options.backers && (
        <div className='Widget-backers'>
          <h2>Meet our backers</h2>
          <UsersList users={users} i18n={i18n} />
        </div>
      )}

      {options.donate && (
        <a href={href} target="_blank">
          <div className='Button Widget-button'>
            Donate
          </div>
        </a>
      )}
    </div>
  )
}
