import React from 'react';
import { Link } from 'react-router';

import ExpenseEmptyState from '../ExpenseEmptyState';
import CollectiveExpenseItem from './CollectiveExpenseItem';


const DEFAULT_EXPENSES_TO_SHOW = 3;

export default class CollectivePendingExpenses extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      itemsToShow: DEFAULT_EXPENSES_TO_SHOW,
      showMoreButton: false
    }
    this.state = Object.assign({}, this.state, this.getStateBasedOnProps(this.props));
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.getStateBasedOnProps(nextProps));
  }

  getStateBasedOnProps(currentProps) {
    const expenses = currentProps.collective.expenses;
    const itemsToShow = this.state.itemsToShow;
    return {
      showMoreButton: expenses.length > itemsToShow,
    }
  }

  showMore(){
    const { expenses } = this.props.collective;
    const { itemsToShow } = this.state;

    this.setState({
      itemsToShow: itemsToShow + DEFAULT_EXPENSES_TO_SHOW,
      showMoreButton: expenses.length > itemsToShow + DEFAULT_EXPENSES_TO_SHOW,
    });
  }

  render() {
    const {
      users,
      collective,
      i18n,
      push
    } = this.props;

    const {
      itemsToShow,
      showMoreButton
    } = this.state


    return (
      <div className='CollectivePendingExpenses col col-12 mb3'>
        <div className='clearfix border-bottom border-gray pb1 mb3'>
          <h4 className='Collective-title left m0 -fw-bold'>{i18n.getString('unpaidExpenses')}</h4>
          <Link className='right mt1 -btn -btn-micro -btn-outline -border-green -fw-bold -ttu' 
            to={`/${collective.slug}/expenses/new`}>
            {i18n.getString('submitExpense')}
          </Link>
        </div>
        {collective.expenses.length === 0 && 
          <div>
            <ExpenseEmptyState i18n={i18n} />
          </div>}

        <div className='CollectivePendingExpenses'>
          {collective.expenses
            .slice(0, itemsToShow)
            .map(expense => 
              <div 
                key={`cl_${expense.id}`}
                className='CollectivePendingExpenses-list' 
                onClick={() => push(`/${collective.slug}/transactions/expenses#exp${expense.id}`)}>
                <CollectiveExpenseItem 
                  expense={expense} 
                  user={users[expense.UserId]} 
                  className='mb2' 
                  i18n={i18n} />
              </div>)}
        </div>
        <div className='flex justify-around'>
        { showMoreButton && 
          <span className='-btn -btn-medium -btn-outline -border-green -ttu -fw-bold' onClick={ ::this.showMore }> {i18n.getString('showMore')} </span> }

        { collective.expenses.length > 0 && (
          <span className='right'>
            <Link className='-btn -btn-medium -btn-outline -border-green -ttu -fw-bold' to={`/${collective.slug}/transactions/expenses`}>
              {i18n.getString('seeAll')} >
            </Link>
          </span>
        )}
        </div>
      </div>
    );
  }
}
