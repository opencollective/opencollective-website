import React, { Component } from 'react';

import { connect } from 'react-redux';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy';

import LoginTopBar from '../containers/LoginTopBar';
import Input from '../components/Input';
import SelectCategory from '../components/SelectCategory';
import ImageUpload from '../components/ImageUpload';
import ExpenseItem from '../components/ExpenseItem';

import Currency from '../components/Currency';
import DisplayUrl from '../components/DisplayUrl';
import Icon from '../components/Icon';
import PublicFooter from '../components/PublicFooter';
import PublicTopBar from '../containers/PublicTopBar';
import SubmitExpense from '../containers/SubmitExpense';
import i18n from '../lib/i18n';

import TransactionItem from '../components/TransactionItem';

import fetchUsers from '../actions/users/fetch_by_group';
import fetchTransactions from '../actions/transactions/fetch_by_group';
import decodeJWT from '../actions/session/decode_jwt';
import Button from '../components/Button';

export class Transactions extends Component {

  constructor(props) {
    super(props);
    this.state = {showSubmitExpense: props.router.location.pathname.match(/new$/) };
  };

  toggleAddExpense() {
    this.setState({ showSubmitExpense: !this.state.showSubmitExpense });
  };

  render() {
    const {
      group,
      transactions,
      users,
      type,
      i18n
    } = this.props;

    const showSubmitExpense = this.state.showSubmitExpense;

    return (
     <div className='Transactions'>
        <LoginTopBar />
        <div className='Transactions-container'>
          <div className='line1'>collective information</div>
          <div className='info-block'>
            <div className='info-block-value'>Hood.ie</div>
            <div className='info-block-label'>collective</div>
          </div>
          <div className='info-block'>
            <div className='info-block-value'>$3,250.30</div>
            <div className='info-block-label'>funds</div>
          </div>
          <div className='line1'>expense details</div>
          <div className="clearfix input-container">
            <div className="col col-6 pr1">
              <ImageUpload {...this.props} value={null} />
            </div>
            <div className="col col-6 pl1">
              <label>amount</label>
              <Input placeholder='' />
              <label>category</label>
              <SelectCategory
                customClass='js-transaction-category'
                attributes={{}}
                categories={['A', 'B', 'C']}
                handleChange={category => console.log(category)} 
              />


              <Input placeholder='Picks A Category' />
              <label>description (optional)</label>
              <Input placeholder='' />
            </div>
          </div>
          <div className='line1'>your information</div>
          <div className="clearfix input-container">
            <div className="col col-6 pr1">
              <label>name</label>
              <Input placeholder='' />
            </div>
            <div className="col col-6 pl1">
              <label>email</label>
              <Input placeholder='' />
            </div>

            <div className="col col-6 pr1">
              <label>reinbursment method</label>
              <Input placeholder='' />
            </div>
            <div className="col col-6 pl1">
              <label>PayPal account/ Account number</label>
              <Input placeholder='' />
            </div>
          </div>
          <div className="Button Button--green">submit expense</div>
        </div>
        <div className='Transactions-container'>
          <div className='line1'>latest expenses</div>
          <div className='expenses-container'>
            <ExpenseItem expense={{category: '', status: ''}} user={null} i18n={i18n}/>
          </div>
          
        </div>

        <div className='PublicContent'>
          <div className='Widget-header'>

            <div className='PublicGroupHeader'>
              <img className='PublicGroupHeader-logo' src={group.logo ? group.logo : '/static/images/media-placeholder.svg'} />
              <div className='PublicGroupHeader-website'><DisplayUrl url={group.website} /></div>
              <div className='PublicGroupHeader-description'>
                {group.description}
              </div>
            </div>

            <div className='Widget-balance'>
              <Currency
                value={group.balance/100}
                currency={group.currency}
                precision={2} />
            </div>
            <div className='Widget-label'>{i18n.getString('fundsAvailable')}</div>
          </div>

          {showSubmitExpense && (<SubmitExpense onCancel={this.toggleAddExpense.bind(this)} />)}

          {type === 'expense' && !showSubmitExpense && (<Button onClick={this.toggleAddExpense.bind(this)} label="Submit Expense" id="submitExpenseBtn" />)}
          <h2>All {type}s</h2>

          <div className='PublicGroup-transactions'>
            {(transactions.length === 0) && (
              <div className='PublicGroup-emptyState'>
                <div className='PublicGroup-expenseIcon'>
                  <Icon type='expense' />
                </div>
                <label>
                {i18n.getString(`${type}List-showUpHere`)}
                </label>
              </div>
            )}
            {transactions.map(tx => <TransactionItem
                                       key={tx.id}
                                       transaction={tx}
                                       i18n={i18n}
                                       user={users[tx.UserId]}
                                       precision={2}
                                       />)}
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  componentWillMount() {
    const {
      group,
      fetchTransactions,
      fetchUsers,
      type
    } = this.props;

    const options = {
      sort: 'createdAt',
      direction: 'desc',
      [type]: true
    };

    fetchTransactions(group.id, options);

    fetchUsers(group.id);
  }

  componentDidMount() {
    // decode here because we don't handle auth on the server side yet
    this.props.decodeJWT();
  }
}

export default connect(mapStateToProps, {
  fetchTransactions,
  fetchUsers,
  decodeJWT
})(Transactions);

function mapStateToProps({
  session,
  groups,
  transactions,
  users,
  router
}) {
  const type = (router.params.type) ? router.params.type.slice(0,-1) : "expense"; // remove trailing s for the API call
  const group = values(groups)[0] || {}; // to refactor to allow only one group
  const list = (type === 'donation') ? transactions.isDonation : transactions.isExpense;

  group.settings = group.settings || { lang: 'en' };

  return {
    session,
    group,
    transactions: sortBy(list, txn => txn.incurredAt || txn.createdAt).reverse(),
    router,
    users,
    i18n: i18n(group.settings.lang),
    type
  };
}
