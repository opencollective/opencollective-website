import React from 'react';
import { Link } from 'react-router';
import UnpaidExpenseItem from './UnpaidExpenseItem';

const DEFAULT_EXPENSES_TO_SHOW = 3;

export default class CollectivePendingExpenses extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      itemsToShow: DEFAULT_EXPENSES_TO_SHOW,
      showMoreButton: false,
      showAllButton: false
    }
  }

  componentWillReceiveProps(nextProps){
    this.updateState(nextProps);
  }

  updateState(currentProps) {
    const expenses = currentProps.collective.expenses;
    const itemsToShow = this.state.itemsToShow;
    // Enable showMore button when there are more than default expenses
    this.setState({showMoreButton: expenses.length > this.state.itemsToShow});
    // Enable showAll button when showMore has been clicked once
    this.setState({showAllButton: expenses.length > itemsToShow && itemsToShow > DEFAULT_EXPENSES_TO_SHOW});
  }

  showMore(){
    this.setState({itemsToShow: this.state.itemsToShow+DEFAULT_EXPENSES_TO_SHOW});
    this.setState({showAllButton: this.props.collective.expenses.length > this.state.itemsToShow + DEFAULT_EXPENSES_TO_SHOW})
  }

  render() {
    const {
      users,
      collective,
      i18n,
      canEditCollective,
      onApprove,
      onPay,
      isHost
    } = this.props;

    const {
      itemsToShow,
      showMoreButton,
      showAllButton
    } = this.state

    if (collective.expenses.length === 0) {
      return (<div/>);
    }

    return (
      <div className='CollectivePendingExpenses col col-12 mb3'>
        <div className='clearfix border-bottom border-gray pb2 mb3'>
          <h4 className='Collective-title left m0 -fw-bold'>{i18n.getString('unpaidExpenses')}</h4>
          <Link className='right mt1 -btn -btn-micro -btn-outline -border-green -fw-bold -ttu' to={`/${collective.slug}/expenses/new`}>{i18n.getString('submitExpense')}</Link>
        </div>
        <div className='Collective-transactions-list'>
          {collective.expenses
            .slice(0, itemsToShow)
            .map(expense => 
              <UnpaidExpenseItem 
                key={`cl_${expense.id}`} 
                expense={expense} 
                user={users[expense.UserId]} 
                className='mb2' 
                i18n={i18n} 
                canEditCollective={ canEditCollective }
                onApprove={ onApprove }
                onPay={ onPay }
                isHost={ isHost } />)}
        </div>
        <div className='flex justify-around'>
        { showMoreButton && 
          <span className='-btn -btn-medium -btn-outline -border-green -ttu -fw-bold' onClick={ ::this.showMore }> {i18n.getString('showMore')} </span> }

        { showAllButton && (
          <span className='right'>
            <Link className='-btn -btn-medium -btn-outline -border-green -ttu -fw-bold' to={`/${collective.slug}/expenses`}>
              {i18n.getString('seeAll')} >
            </Link>
          </span>
        )}
        </div>
      </div>
    );
  }
}
