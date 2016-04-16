import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import EXPENSE_ICONS from '../constants/expense_icons';
import Currency from './Currency';

export default class ExpenseItem extends Component {
  static propTypes = {
    expense: PropTypes.object.isRequired,
    user: PropTypes.object
  };

  static defaultProps = {
    expense: {},
    user: {
      name: 'Anonymous',
      avatar: '/static/images/default_avatar.svg'
    }
  };

  _getStatus(expense) {
    if (!!expense.reimbursedAt) {
      return 'Reimbursed';
    }

    if (expense.approvedAt && expense.approved) {
      return 'Approved';
    }

    if (expense.approvedAt && !expense.approved) {
      return 'Rejected';
    }

    return 'Pending';
  }

  render() {
    const { className = '', expense, user } = this.props;
    let categoryName = (expense.tags && expense.tags.length) ? expense.tags[0].toLowerCase().replace(/\W/g, '-') : '';

    if (EXPENSE_ICONS.indexOf(categoryName) < 0) {
      categoryName = 'default';
    }

    const iconName = `category-${categoryName}`;

    return (
      <div className={`ExpenseItem flex overflow-hidden border ${className}`}>
        <div className={`ExpenseItem-category category-${categoryName} flex flex-column items-center justify-between px1 py2 border-box`}>
          <div className='ExpenseItem-category-icon-wrapper circle flex justify-center items-center'>
            <svg width='1.875rem' height='1.875rem' className='white'>
              <use xlinkHref={`#svg-${iconName}`}/>
            </svg>
          </div>
          <div className='h6 white -fw-bold'>{expense.createdAt && moment(expense.createdAt).fromNow()}</div>
        </div>
        <div className='p2 flex-auto bg-white'>
          <p className='h5 mt0 mb1'>{expense.tags || expense.description}</p>
          <p className='h6 m0 muted'>Submitted by {user && user.name}</p>
          <div className='mt2'>
            <span className='h3 -ff-sec -fw-bold'>
              <Currency value={expense.amount} currency={expense.currency} colorify={false} />
            </span>
            <span className='ExpenseStatus border align-middle ml1 muted -fw-bold -ttu'>{this._getStatus(expense)}</span>
          </div>
        </div>
      </div>
    );
  }
}
