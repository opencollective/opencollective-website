import React, {PropTypes} from 'react';
import { Link } from 'react-router';

import Currency from '../Currency';
import { EXPENSE_STATUS } from '../../constants/expenses';

const UnpaidExpenseItem = ({ 
  className = '', 
  expense, 
  user, 
  i18n, 
  canEditCollective,
  collective,
  isHost
}) => {

  const canApprove = canEditCollective || isHost;
  
  return (
    <div className={`UnpaidExpenseItem flex flex-column overflow-hidden border p2 ${className}`}>
      <div className='-ff-sec truncate'> { expense.title || expense.category } </div>
      <div className='flex'>
        <p className='h6 m0 muted'>{i18n.getString('submittedBy')} {user && user.name} { expense.incurredAt && i18n.moment(expense.incurredAt).fromNow() } </p>
      </div>
      <div className='h3 -ff-sec'>
        <Currency value={expense.amount} currency={expense.currency} colorify={false} />
      </div>
      <Link to={`${collective.slug}/all_expenses`}>
        <div className='-ff-sec border-top flex justify-end'>
          {canApprove && expense.status === EXPENSE_STATUS.PENDING && 
            <span className='ExpenseAction align-middle ml1 muted -fw-bold -ttu'> Approve/Reject > </span> }
            
          {!canApprove && expense.status === EXPENSE_STATUS.PENDING && 
            <span className='ml1 muted -fw-bold'> Awaiting approval </span>}

          {isHost && expense.status === EXPENSE_STATUS.APPROVED && 
            <span className='ExpenseAction align-middle ml1 muted -fw-bold -ttu'> Pay > </span> }

          {!isHost && expense.status === EXPENSE_STATUS.APPROVED && 
            <span className='ExpenseAction align-middle ml1 muted -fw-bold'> Awaiting payment </span> }


        </div>
      </Link>
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
