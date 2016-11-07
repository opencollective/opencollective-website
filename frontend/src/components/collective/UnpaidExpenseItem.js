import React, {PropTypes} from 'react';
import EXPENSE_ICONS from '../../constants/expense_icons';
import Currency from '../../components/Currency';
import { EXPENSE_STATUS } from '../../constants/expenses';

const UnpaidExpenseItem = ({ 
  className = '', 
  expense, 
  user, 
  i18n, 
  canEditCollective, 
  onApprove,
  onPay,
  isHost
}) => {
  
  const categoryName = getCategoryName(expense.category);

  return (
    <div className={`UnpaidExpenseItem flex overflow-hidden border ${className}`}>
      <div className={`UnpaidExpenseItem-category ${categoryName} flex flex-column items-center justify-between px1 py2 border-box`}>
        <div className='UnpaidExpenseItem-category-icon-wrapper circle flex justify-center items-center'>
          <svg width='1.875rem' height='1.875rem' className='white'>
            <use xlinkHref={`#svg-${categoryName}`}/>
          </svg>
        </div>
        <div className='h6 white -fw-bold'>{expense.incurredAt && i18n.moment(expense.incurredAt).fromNow()}</div>
      </div>
      <div className='p2 flex-auto bg-white'>
        <p className='h5 mt0 mb1'>{expense.title || expense.category}</p>
        <p className='h6 m0 muted'>{i18n.getString('submittedBy')} {user && user.name}</p>
        <div className='mt2'>
          <span className='h3 -ff-sec -fw-bold'>
            <Currency value={expense.amount} currency={expense.currency} colorify={false} />
          </span>
          <span className='ExpenseStatus border align-middle ml1 muted -fw-bold -ttu'>{i18n.getString(expense.status.toLowerCase())}</span>
          {canEditCollective && expense.status === EXPENSE_STATUS.PENDING && 
            <span className='ExpenseAction align-middle ml1 muted -fw-bold -ttu' onClick={() => onApprove(expense.id)}> Approve </span> }
          {isHost && expense.status === EXPENSE_STATUS.APPROVED && 
            <span className='ExpenseAction align-middle ml1 muted -fw-bold -ttu' onClick={() => onPay(expense.id)}> Pay </span> }
        </div>
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

function getCategoryName(category) {
  let categoryName = category ? category.toLowerCase().replace(/\W/g, '-') : '';

  if (EXPENSE_ICONS.indexOf(categoryName) < 0) {
    categoryName = 'default';
  }
  return `category-${categoryName}`;
}
