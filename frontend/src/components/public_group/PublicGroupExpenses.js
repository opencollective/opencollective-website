import React from 'react';
import { Link } from 'react-router';
import ExpenseItem from '../../components/ExpenseItem';

export default class PublicGroupExpenses extends React.Component {
  render() {
    const {
      users,
      group,
      i18n,
      itemsToShow = 3
    } = this.props;

    const emptyState = (
      <div className='center'>
        <div className='PublicGroup-emptyState-image flex items-center justify-center'>
          <img width='111' height='151'
            src='/static/images/collectives/expenses-empty-state-image.jpg'
            srcSet='/static/images/collectives/expenses-empty-state-image@2x.jpg 2x'/>
        </div>
        <p className='h3 -fw-bold'>{i18n.getString('expensesPlaceholderTitle')}</p>
        <p className='h5 muted mb3'>{i18n.getString('expensesPlaceholderText')}</p>
        <Link className='-btn -btn-medium -btn-outline -border-green -ff-sec -fw-bold -ttu' to={`/${group.slug}/expenses/new`}>{i18n.getString('submitExpense')}</Link>
      </div>
    );

    return (
      <div className='PublicGroup-expenses col md-col-6 col-12 px2 mb3'>
        <div className='clearfix border-bottom border-gray pb2 mb3'>
          <h2 className='PublicGroup-title left m0 -ff-sec -fw-bold'>{i18n.getString('latestExpenses')}</h2>
          {(group.expenses.length > 0) && (
            <Link className='right mt1 -btn -btn-micro -btn-outline -border-green -ff-sec -fw-bold -ttu' to={`/${group.slug}/expenses/new`}>{i18n.getString('submitExpense')}</Link>
          )}
        </div>
        {(group.expenses.length === 0) && emptyState}
        <div className='PublicGroup-transactions-list'>
          {group.expenses.map(expense => <ExpenseItem key={`pge_${expense.id}`} expense={expense} user={users[expense.UserId]} className='mb2' i18n={i18n} />)}
        </div>
        {group.expenses.length >= itemsToShow && (
          <div className='center pt2'>
            <Link className='-btn -btn-medium -btn-outline -border-green -ttu -ff-sec -fw-bold' to={`/${group.slug}/expenses`}>
              {i18n.getString('expensesHistory')}
            </Link>
          </div>
        )}
      </div>
    );
  }
}
