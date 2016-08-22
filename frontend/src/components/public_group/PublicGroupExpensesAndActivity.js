import React, { Component } from 'react';

import PublicGroupDonations from './PublicGroupDonations';
import PublicGroupExpenses from './PublicGroupExpenses';

export default class PublicGroupExpensesAndActivity extends Component {
  render() {
    const { group, expenses, donations, users, itemsToShow } = this.props;
    return (
      <section id='expenses-and-activity' className='px2'>
        <div className='container'>
          <div className='PublicGroup-transactions clearfix md-flex'>
            <PublicGroupExpenses group={ group } expenses={ expenses } users={ users } itemsToShow={ itemsToShow } {...this.props} />
            <PublicGroupDonations group={ group } donations={ donations } users={ users } itemsToShow={ itemsToShow } {...this.props} />
          </div>
        </div>
      </section>
    )
  }
}
