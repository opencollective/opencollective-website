import React, {PropTypes} from 'react';

import EXPENSE_ICONS from '../../constants/expense_icons';
import { EXPENSE_STATUS } from '../../constants/expenses';

import Currency from '../../components/Currency';
import ReceiptPreview from '../../components/ReceiptPreview';

const CollectiveExpenseDetail = ({ 
  className = '', 
  expense, 
  user, 
  i18n, 
  canEditCollective, 
  onApprove,
  onPay,
  isHost
}) => {
  
  return (
    <div className='ExpenseDetail flex'>
      
      {(canEditCollective || isHost) && expense.attachment && (
          <div className='ExpenseDetail-image'>
            <ReceiptPreview
              src={expense.attachment}
              href={expense.attachment}
            />
          </div>
        )}
      <div className='ExpenseDetail-info flex flex-column'>
        <span className=''>{ expense.title }</span>
        <p className='h3'>
          <Currency value={expense.amount} currency={expense.currency} colorify={true} /> 
        </p>
        <span className=''>{ expense.incurredAt && i18n.moment(expense.incurredAt).fromNow() } </span>
        <span className=''>{ i18n.getString('submittedBy') } { user && user.name }</span>
        {(canEditCollective || isHost) && <div className=''>
          {i18n.getString('payoutMethod')}
        </div>}
      </div>
      <div className='ExpenseDetail-actions'>
        {canEditCollective && expense.status === EXPENSE_STATUS.PENDING && 
          <span className='ExpenseAction align-middle ml1 muted -fw-bold -ttu' onClick={() => onApprove(expense.id)}> Approve </span> }
        {isHost && expense.status === EXPENSE_STATUS.APPROVED && 
          <span className='ExpenseAction align-middle ml1 muted -fw-bold -ttu' onClick={() => onPay(expense.id)}> Pay </span> }
      </div>

    </div>
    )
};

CollectiveExpenseDetail.propTypes = {
  canEditCollective: PropTypes.bool.isRequired,
  expense: PropTypes.object.isRequired,
  approveExpense: PropTypes.func,
  user: PropTypes.object
};

CollectiveExpenseDetail.defaultProps = {
  canEditCollective: false,
  expense: {},
  user: {
    name: 'Anonymous',
    avatar: '/static/images/default_avatar.svg'
  },
};

export default CollectiveExpenseDetail;