import React, {PropTypes} from 'react';
import ReactTooltip from 'react-tooltip';

import { resizeImage } from '../../lib/utils';

import { EXPENSE_STATUS, PAYOUT_METHODS } from '../../constants/expenses';

import Currency from '../../components/Currency';
import ReceiptPreview from '../../components/ReceiptPreview';
import ApproveButton from '../../components/ApproveButton';
import RejectButton from '../../components/RejectButton';
import PayButton from '../../components/PayButton';
import Select from '../../components/Select';

import payoutMethods from '../../ui/payout_methods';

class CollectiveExpenseItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      switchReimbursementMethod: false,
      payoutMethod: this.props.expense.payoutMethod
    }
  }

  render () { 
    const {
      expense, 
      user, 
      i18n,
      compact,
      canApproveOrReject,
      canPay, 
      onApprove,
      onReject,
      onPay,
      onUpdate,
      hasPaypalCard,
      authenticatedUser,
      approveInProgress,
      rejectInProgress,
      payInProgress
    } = this.props;

    const canViewReceipt = canApproveOrReject || (authenticatedUser && authenticatedUser.id === expense.UserId);

    // compute which actions to show
    const showApprove = !compact && canApproveOrReject && expense.status === EXPENSE_STATUS.PENDING;
    const showReject = !compact && canApproveOrReject && expense.status === EXPENSE_STATUS.PENDING;
    // We can pay if we have a paypal card or if payoutMethod is other
    const showPay = !compact && canPay && expense.status === EXPENSE_STATUS.APPROVED && (expense.payoutMethod !== PAYOUT_METHODS.paypal || hasPaypalCard);

    const updateInProgress = approveInProgress[expense.id] || rejectInProgress[expense.id] || payInProgress[expense.id];

    const userEmail = user && (user.paypalEmail || user.email);

    let src, srcSet, href, receiptMessage, receiptHelpTip;

    let submittedByName = user && user.name;

    // show email only if the user can view receipt
    if (canViewReceipt) {
      submittedByName = user && user.name && userEmail ? `${user.name} - ${userEmail}` : `${userEmail}`;
    }

    if (canViewReceipt && expense.attachment) {
      src = resizeImage(expense.attachment, { width: 240 });
      srcSet = resizeImage(expense.attachment, { width: 480 });
      href = expense.attachment;
      receiptMessage = '';
      receiptHelpTip = i18n.getString('validReceiptHelpTip');
    } else {
      src='/public/svg/ticket.svg';
      href = '';
      if (canViewReceipt) {
        receiptMessage = i18n.getString('missingReceiptMessage');
        receiptHelpTip = i18n.getString('missingReceiptHelpTip');
      } else {
        receiptMessage = i18n.getString('hiddenReceiptMessage');
        receiptHelpTip = i18n.getString('hiddenReceiptHelpTip');
      }
    }

    const payoutMethodString = this.state.payoutMethod === PAYOUT_METHODS.paypal ? `PayPal (${expense.user.paypalEmail || expense.user.email})` : this.state.payoutMethod;
    const payButtonLabel = (expense.payoutMethod === PAYOUT_METHODS.paypal) ? 'Pay using PayPal' : 'Paid'
   
    return (
      <div className='CollectiveExpenseItem' id={`exp${expense.id}`}>
        <div className='mx-auto mb2 p2 flex bg-white border-white'>
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
              <img className='help' src='/public/svg/help.svg' data-tip={receiptHelpTip} />
              <ReactTooltip effect='solid' border={true} place='bottom' />
            </div>
          </div>}

          <div className='flex flex-column flex-auto'>
            <div className='CollectiveExpenseItem-info'>
              <div className='-ff-sec'>{ expense.title } ({expense.category})</div>
              <div className='h6 m0 muted' title={i18n.moment(expense.incurredAt).format('MMMM Do YYYY')}>{ i18n.getString('submittedBy') } { submittedByName } - { expense.incurredAt && i18n.moment(expense.incurredAt).fromNow() } </div>
              


              {expense.notes && canViewReceipt && <div className='h6 m0'><b>Notes:</b> {expense.notes}</div>}
              <p className='h3 -ff-sec amount'>
                <Currency value={expense.amount} currency={expense.currency} colorify={false} /> 
              </p>

              {canViewReceipt && 
                <div className='h6 m0'>
                  <b>Reimburse via:</b> {payoutMethodString} 
                  {expense.payoutMethod === PAYOUT_METHODS.paypal && !this.state.switchReimbursementMethod && 
                    <span className='CollectiveExpenseItem-switch' onClick={() => this.setState({switchReimbursementMethod: true, payoutMethod: PAYOUT_METHODS.other})}> Already Reimbursed? </span>}
                  {expense.payoutMethod !== PAYOUT_METHODS.paypal && !this.state.switchReimbursementMethod &&
                    <span className='CollectiveExpenseItem-switch' onClick={() => this.setState({switchReimbursementMethod: true, payoutMethod: PAYOUT_METHODS.paypal})}> Use PayPal? </span>}
                  {this.state.switchReimbursementMethod && 
                    <span>
                      <span className='CollectiveExpenseItem-switch' onClick={() => this.setState({switchReimbursementMethod: false, payoutMethod: expense.payoutMethod})}> Cancel </span>
                      <span className='CollectiveExpenseItem-switch' onClick={::this.saveExpense}> Save </span>
                    </span>}
                </div> }

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
                  className={expense.payoutMethod}
                  onClick={onPay.bind(null, expense.id)}
                  inProgress={payInProgress[expense.id]}
                  label={payButtonLabel}
                  i18n={i18n} />}
              { showPay && expense.payoutMethod !== PAYOUT_METHODS.paypal && <div className="h6 muted">(Please make sure you have paid this expense manually before clicking on "Paid")</div>}
            </div>}
          </div>       
        </div>
      </div>)
  }

  saveExpense() {
    const {
      expense,
      onUpdate
    } = this.props;

    if (this.state.switchReimbursementMethod) {
      if (expense.payoutMethod === PAYOUT_METHODS.paypal) {
        return onUpdate({payoutMethod: PAYOUT_METHODS.other})
          .then(() => this.setState({switchReimbursementMethod: false}))
      } else {
        return onUpdate({payoutMethod: PAYOUT_METHODS.paypal})
          .then(() => this.setState({switchReimbursementMethod: false}))
      }
    }
  }
}

CollectiveExpenseItem.propTypes = {
  expense: PropTypes.object.isRequired, 
  i18n: PropTypes.object.isRequired,

  user: PropTypes.object, 
  authenticatedUser: PropTypes.object,  
  compact: PropTypes.bool,
  canApproveOrReject: PropTypes.bool,
  canPay: PropTypes.bool,
  hasPaypalCard: PropTypes.bool,
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
    avatar: '/public/images/default_avatar.svg'
  },
  authenticatedUser: {},
  compact: true,
  canApproveOrReject: false,
  canPay: false,
  hasPaypalCard: false,
  approveInProgress: {},
  rejectInProgress: {},
  payInProgress: {}
};

export default CollectiveExpenseItem;