import React from 'react';
import { Link } from 'react-router';
import ExpenseItem from '../../components/ExpenseItem';

export default class CollectivePendingExpenses extends React.Component {
  render() {
    const {
      users,
      collective,
      i18n,
      itemsToShow = 3
    } = this.props;

    return (
      <div className='CollectivePendingExpenses col col-12 mb3'>
        <div className='clearfix border-bottom border-gray pb2 mb3'>
          <h4 className='Collective-title left m0 -ff-sec -fw-bold'>{i18n.getString('pendingExpenses')}</h4>
          <Link className='right mt1 -btn -btn-micro -btn-outline -border-green -ff-sec -fw-bold -ttu' to={`/${collective.slug}/expenses/new`}>{i18n.getString('submitExpense')}</Link>
        </div>
        <div className='Collective-transactions-list'>
          {collective.expenses.slice(0, itemsToShow).map(expense => <ExpenseItem key={`cl_${expense.id}`} expense={expense} user={users[expense.UserId]} className='mb2' i18n={i18n} />)}
        </div>
        {collective.expenses.length >= itemsToShow && (
          <div className='center pt2'>
            <Link className='-btn -btn-medium -btn-outline -border-green -ttu -ff-sec -fw-bold' to={`/${collective.slug}/expenses`}>
              {i18n.getString('expensesHistory')}
            </Link>
          </div>
        )}
      </div>
    );
  }
}
