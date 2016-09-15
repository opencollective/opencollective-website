import React, {PropTypes} from 'react';
import EXPENSE_ICONS from '../constants/expense_icons';
import Currency from './Currency';

const ExpenseItem = ({ className = '', expense, user, i18n }) => {
  const categoryName = getCategoryName(expense.category);

  return (
    <div className={`ExpenseItem flex overflow-hidden border ${className}`}>
      <div className={`ExpenseItem-category ${categoryName} flex flex-column items-center justify-between px1 py2 border-box`}>
        <div className='ExpenseItem-category-icon-wrapper circle flex justify-center items-center'>
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
            <Currency value={expense.amount/100} currency={expense.currency} colorify={false} />
          </span>
          <span className='ExpenseStatus border align-middle ml1 muted -fw-bold -ttu'>{i18n.getString(expense.status.toLowerCase())}</span>
        </div>
      </div>
    </div>
  );
};

ExpenseItem.propTypes = {
  expense: PropTypes.object.isRequired,
  user: PropTypes.object
};

ExpenseItem.defaultProps = {
  expense: {},
  user: {
    name: 'Anonymous',
    avatar: '/static/images/default_avatar.svg'
  }
};

export default ExpenseItem;

function getCategoryName(category) {
  let categoryName = category ? category.toLowerCase().replace(/\W/g, '-') : '';

  if (EXPENSE_ICONS.indexOf(categoryName) < 0) {
    categoryName = 'default';
  }
  return `category-${categoryName}`;
}
