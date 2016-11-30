import React, {PropTypes} from 'react';
import ReactTooltip from 'react-tooltip';

import { resizeImage } from '../../lib/utils';

import { EXPENSE_STATUS } from '../../constants/expenses';

import Currency from '../../components/Currency';
import ReceiptPreview from '../../components/ReceiptPreview';
import ApproveButton from '../../components/ApproveButton';
import RejectButton from '../../components/RejectButton';
import PayButton from '../../components/PayButton';


const CollectiveExpenseItem = ({ 
  expense, 
  user, 
  i18n,
  compact,
  canApproveOrReject,
  canPay, 
  onApprove,
  onReject,
  onPay,
  authenticatedUser,
  approveInProgress,
  rejectInProgress,
  payInProgress
}) => {

  const canViewReceipt = canApproveOrReject || (authenticatedUser && authenticatedUser.id === expense.UserId);

  // compute which actions to show
  const showApprove = !compact && canApproveOrReject && expense.status === EXPENSE_STATUS.PENDING;
  const showReject = !compact && canApproveOrReject && expense.status === EXPENSE_STATUS.PENDING;
  const showPay = !compact && canPay && expense.status === EXPENSE_STATUS.APPROVED;

  const updateInProgress = approveInProgress[expense.id] || rejectInProgress[expense.id] || payInProgress[expense.id];

  let src, srcSet, href, receiptMessage, receiptHelpTip;

  if (canViewReceipt && expense.attachment) {
    src = resizeImage(expense.attachment, { width: 240 });
    srcSet = resizeImage(expense.attachment, { width: 480 });
    href = expense.attachment;
    receiptMessage = '';
    receiptHelpTip = i18n.getString('validReceiptHelpTip');
  } else {
    src='/static/svg/ticket.svg';
    href = '';
    if (canViewReceipt) {
      receiptMessage = i18n.getString('missingReceiptMessage');
      receiptHelpTip = i18n.getString('missingReceiptHelpTip');
    } else {
      receiptMessage = i18n.getString('hiddenReceiptMessage');
      receiptHelpTip = i18n.getString('hiddenReceiptHelpTip');
    }
  }
  
 
  return (
    <section id={`exp${expense.id}`}>
      <div className='CollectiveExpenseItem mx-auto mb2 p2 flex bg-white border-white'>
        {!compact && <div className='CollectiveExpenseItem-top flex flex-column mr2'>
          <div className='CollectiveExpenseItem-image max-width-1'>
            <ReceiptPreview
              src={src}
              srcSet={srcSet}
              href={href}
            />
          </div>
          <div className='flex justify-center'>
            <span className='h6 muted'> {receiptMessage} </span>
            <img className='help' src='/static/svg/help.svg' data-tip={receiptHelpTip} />
            <ReactTooltip effect='solid' border={true} place='bottom' />
          </div>  
        </div>}

        <div className='flex flex-column flex-auto'>
          <div className='CollectiveExpenseItem-info'>
            <div className='-ff-sec'>{ expense.title } ({expense.category})</div>
            <div className='h6 m0 muted'>{ i18n.getString('submittedBy') } { user && user.name } - { expense.incurredAt && i18n.moment(expense.incurredAt).fromNow() } </div>
            <p className='h3 -ff-sec amount'>
              <Currency value={expense.amount} currency={expense.currency} colorify={false} /> 
            </p>
            <div className='-ff-sec flex h6 mb1'>
              <span className='CollectiveExpenseItemStatus border align-middle muted -fw-bold -ttu'>{i18n.getString(expense.status.toLowerCase())}</span>
            </div>
          </div>
          {!compact && <div className='CollectiveExpenseItem-actions'>
            {showApprove && 
              <ApproveButton
                disabled={updateInProgress}
                onClick={onApprove.bind(null, expense.id)}
                inProgress={approveInProgress[expense.id]}
                i18n={i18n} />}
            {showReject && 
              <RejectButton
                disabled={updateInProgress}
                onClick={onReject.bind(null, expense.id)}
                inProgress={rejectInProgress[expense.id]}
                i18n={i18n} />}
            {showPay && 
              <PayButton
                disabled={updateInProgress}
                onClick={onPay.bind(null, expense.id)}
                inProgress={payInProgress[expense.id]}
                i18n={i18n} />}
          </div>}
        </div>       
      </div>
    </section>
    )
};

CollectiveExpenseItem.propTypes = {
  expense: PropTypes.object.isRequired, 
  i18n: PropTypes.object.isRequired,

  user: PropTypes.object, 
  authenticatedUser: PropTypes.object,  
  compact: PropTypes.bool,
  canApproveOrReject: PropTypes.bool,
  canPay: PropTypes.bool, 
  approveInProgress: PropTypes.object,
  rejectInProgress: PropTypes.object,
  payInProgress: PropTypes.object,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onPay: PropTypes.func,
};

CollectiveExpenseItem.defaultProps = {
  user: {
    name: 'Anonymous',
    avatar: '/static/images/default_avatar.svg'
  },
  authenticatedUser: {},
  compact: true,
  canApproveOrReject: false,
  canPay: false,
  approveInProgress: {},
  rejectInProgress: {},
  payInProgress: {}
};

export default CollectiveExpenseItem;