import React, {PropTypes} from 'react';
import ReactTooltip from 'react-tooltip';

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
      <div className='CollectiveExpenseDetail mx-auto mb2 p2 flex bg-white col-8 border-white rounded'>

        <div className='CollectiveExpenseDetail-top flex flex-column mr2'>
        
          <div className='CollectiveExpenseDetail-image max-width-1'>
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
        </div>

        <div>
          <div className='CollectiveExpenseDetail-info flex flex-column'>
            <span className='-ff-sec'>{ expense.title } ({expense.category})</span>
            <span className='h6 m0 muted'>{ i18n.getString('submittedBy') } { user && user.name } - { expense.incurredAt && i18n.moment(expense.incurredAt).fromNow() } </span>
            <p className='h3 -ff-sec'>
              <Currency value={expense.amount} currency={expense.currency} colorify={false} /> 
            </p>
          </div>
          <div className='CollectiveExpenseDetail-actions flex justify-around'>
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

       
      </div>
    </section>
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