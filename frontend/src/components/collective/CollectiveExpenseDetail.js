import React, {PropTypes} from 'react';

import { resizeImage } from '../../lib/utils';

import { EXPENSE_STATUS } from '../../constants/expenses';

import Currency from '../../components/Currency';
import ReceiptPreview from '../../components/ReceiptPreview';
import ApproveButton from '../../components/ApproveButton';
import RejectButton from '../../components/RejectButton';
import PayButton from '../../components/PayButton';


const CollectiveExpenseDetail = ({ 
  expense, 
  user, 
  i18n, 
  canEditCollective, 
  onApprove,
  onReject,
  onPay,
  isHost,
  authenticatedUser,
  approveInProgress,
  rejectInProgress,
  payInProgress
}) => {

  // compute permissions
  const canViewReceipt = canEditCollective || isHost || (authenticatedUser && authenticatedUser.id === expense.UserId);
  const canApproveOrReject = canEditCollective || isHost;
  const canPay = isHost;

  // compute which actions to show
  const showApprove = canApproveOrReject && expense.status === EXPENSE_STATUS.PENDING;
  const showReject = canApproveOrReject && expense.status === EXPENSE_STATUS.PENDING;
  const showPay = canPay && expense.status === EXPENSE_STATUS.APPROVED;

  const updateInProgress = approveInProgress[expense.id] || rejectInProgress[expense.id] || payInProgress[expense.id];

  let src, srcSet, href;

  if (canViewReceipt && expense.attachment) {
    src = resizeImage(expense.attachment, { width: 240 });
    srcSet = resizeImage(expense.attachment, { width: 480 });
    href = expense.attachment;
  } else {
    src='/static/images/collectives/expenses-empty-state-image.jpg';
    srcSet='/static/images/collectives/expenses-empty-state-image@2x.jpg 2x';
    href = '';
  }
  
 
  return (
    <div className='ExpenseDetail mb2 flex flex-column'>

      <div className='ExpenseDetail-top flex'>
      
        <div className='ExpenseDetail-image max-width-1'>
          <ReceiptPreview
            src={src}
            srcSet={srcSet}
            href={href}
          />
        </div>

        <div className='ExpenseDetail-info flex flex-column'>
          <span className=''>{ expense.title }</span>
           <div className='ExpenseDetail-category'>
            {expense.category}
          </div>
          <p className='h3'>
            <Currency value={expense.amount} currency={expense.currency} colorify={true} /> 
          </p>
          <span className=''>{ expense.incurredAt && i18n.moment(expense.incurredAt).fromNow() } </span>
          <span className=''>{ i18n.getString('submittedBy') } { user && user.name }</span>
          
        </div>
      </div>

      <div className='ExpenseDetail-actions flex justify-center'>
        {showApprove && 
          <ApproveButton
            disabled={updateInProgress}
            approveExp={onApprove.bind(null, expense.id)}
            inProgress={approveInProgress[expense.id]}
            i18n={i18n} />}
        {showReject && 
          <RejectButton
            disabled={updateInProgress}
            rejectExp={onReject.bind(null, expense.id)}
            inProgress={rejectInProgress[expense.id]}
            i18n={i18n} />}
        {showPay && 
          <PayButton
            disabled={updateInProgress}
            payExp={onPay.bind(null, expense.id)}
            inProgress={payInProgress[expense.id]}
            i18n={i18n} />}
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