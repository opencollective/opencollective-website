import React, {PropTypes} from 'react';

import Currency from '../Currency';

const UnpaidExpenseItem = ({ 
  className = '', 
  expense, 
  user, 
  i18n, 
  collective,
  push
}) => {
  
  return (
    <div className={`UnpaidExpenseItem flex flex-column overflow-hidden border p2 ${className}`} onClick={() => push(`/${collective.slug}/unpaid-expenses#exp${expense.id}`)}>
      <div className='-ff-sec truncate'> { expense.title || expense.category } </div>
      <div className='flex'>
        <p className='h6 m0 muted'>{i18n.getString('submittedBy')} {user && user.name} &#8212; { expense.incurredAt && i18n.moment(expense.incurredAt).fromNow() } </p>
      </div>
      <div className='h3 -ff-sec'>
        <Currency value={expense.amount} currency={expense.currency} colorify={false} />
      </div>
      <div className='-ff-sec flex h6'>
       <span className='ExpenseStatus border align-middle muted -fw-bold -ttu'>{i18n.getString(expense.status.toLowerCase())}</span>
      </div>
    </div>
  );
};

UnpaidExpenseItem.propTypes = {
  canEditCollective: PropTypes.bool.isRequired,
  expense: PropTypes.object.isRequired,
  approveExpense: PropTypes.func,
  user: PropTypes.object
};

UnpaidExpenseItem.defaultProps = {
  canEditCollective: false,
  expense: {},
  user: {
    name: 'Anonymous',
    avatar: '/static/images/default_avatar.svg'
  },
};

export default UnpaidExpenseItem;
