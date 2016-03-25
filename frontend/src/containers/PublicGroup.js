import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';
import take from 'lodash/array/take';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy';

import filterCollection from '../lib/filter_collection';
import formatCurrency from '../lib/format_currency';

import roles from '../constants/roles';
import PublicTopBarV2 from '../containers/PublicTopBarV2';
import Notification from '../containers/Notification';
import PublicFooter from '../components/PublicFooter';
import PublicGroupThanks from '../components/PublicGroupThanks';
import Media from '../components/Media';
import Metric from '../components/Metric';
import UserCard from '../components/UserCard';
import ExpenseItem from '../components/ExpenseItem';
import ActivityItem from '../components/ActivityItem';
import {displayUrl} from '../components/DisplayUrl';
import PublicGroupSignup from '../components/PublicGroupSignup';
import Tiers from '../components/Tiers';
import Markdown from '../components/Markdown';

import fetchGroup from '../actions/groups/fetch_by_id';
import fetchUsers from '../actions/users/fetch_by_group';
import fetchTransactions from '../actions/transactions/fetch_by_group';
import donate from '../actions/groups/donate';
import notify from '../actions/notification/notify';
import appendDonationForm from '../actions/form/append_donation';
import appendProfileForm from '../actions/form/append_profile';
import updateUser from '../actions/users/update';
import validateSchema from '../actions/form/validate_schema';
import decodeJWT from '../actions/session/decode_jwt';

import profileSchema from '../joi_schemas/profile';

// Number of expenses and revenue items to show on the public page
const NUM_TRANSACTIONS_TO_SHOW = 3;

export class PublicGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showThankYouMessage: false,
      showUserForm: false
    };
  }

  donationSection() {
    const {
      group,
      isAuthenticated,
      donationForm,
      showPaypalThankYou
    } = this.props;

    if (this.state.showThankYouMessage || (isAuthenticated && this.state.showUserForm) || showPaypalThankYou) { // we don't handle userform from logged in users) {
      return <PublicGroupThanks />;
    } else if (this.state.showUserForm) {
      return <PublicGroupSignup {...this.props} save={saveNewUser.bind(this)} />
    } else {
      return <Tiers tiers={group.tiers} {...this.props} form={donationForm} onToken={donateToGroup.bind(this)} />
    }
  }

  expenseList() {
    const {
      expenses,
      users,
      group
    } = this.props;

    const emptyState = (
      <div className='center'>
        <div className='PublicGroup-emptyState-image flex items-center justify-center'>
          <img width='112' height='151'
            src='/static/images/collectives/expenses-empty-state-image.jpg'
            srcSet='/static/images/collectives/expenses-empty-state-image@2x.jpg 2x'/>
        </div>
        <p className='h3 -fw-bold'>Transparency is a great quality.</p>
        <p className='h5 muted mb3'>Submit an expense, get reimbursed and show how funds are being spent!</p>
        <Link className='-btn -btn-medium -btn-outline -border-green -ff-sec -fw-bold -ttu' to={`/${group.slug}/expenses/new`}>Submit expense</Link>
      </div>
    );

    return (
      <div className='PublicGroup-expenses col md-col-6 col-12 px2 mb3'>
        <div className='clearfix border-bottom border-gray pb2 mb3'>
          <h2 className='left m0 -ff-sec'>Out Latest Expenses</h2>
          {expenses.length ? (
            <Link className='right -btn -btn-small -btn-outline -border-green -ff-sec -fw-bold -ttu' to={`/${group.slug}/expenses/new`}>Submit expense</Link>
          ) : null}
        </div>
        {(expenses.length === 0) && emptyState}
        <div className='PublicGroup-transactions-list'>
          {expenses.map(expense => <ExpenseItem key={`pge_${expense.id}`} expense={expense} user={users[expense.UserId]} className='mb2' />)}
        </div>
        {expenses.length >= NUM_TRANSACTIONS_TO_SHOW && (
          <div className='center pt2'>
            <Link className='-btn -btn-medium -btn-outline -border-green -ttu -ff-sec -fw-bold' to={`/${group.slug}/expenses`}>
              Full expense history
            </Link>
          </div>
        )}
      </div>
    );
  }

  donationList() {
    const {
      donations,
      users,
      group
    } = this.props;

    const emptyState = (
      <div className='center'>
        <div className='PublicGroup-emptyState-image flex items-center justify-center'>
          <img width='134' height='120'
            src='/static/images/collectives/activities-empty-state-image.jpg'
            srcSet='/static/images/collectives/activities-empty-state-image@2x.jpg 2x'/>
        </div>
        <p className='h3 -fw-bold'>What you do proves your beliefs.</p>
        <p className='h5 muted'>People should know what stuff is being done for the community!</p>
      </div>
    );

    return (
      <div className='PublicGroup-donations col md-col-6 col-12 px2 mb3'>
        <h2 className='m0 border-bottom border-gray pb2 mb3 -ff-sec'>Recent Activity</h2>
        {(donations.length === 0) && emptyState}
        <div className='PublicGroup-transactions-list'>
          {donations.map(donation => <ActivityItem key={`pgd_${donation.id}`} donation={donation} user={users[donation.UserId]} className='mb2' />)}
        </div>
        {donations.length >= NUM_TRANSACTIONS_TO_SHOW && (
          <Link className='PublicGroup-tx-link -ttu' to={`/${group.slug}/donations`}>
            See all donations
          </Link>
        )}
      </div>
    );
  }

  render() {
    const {
      group,
      // shareUrl,
    } = this.props;

    const collectiveBg = '/static/images/collectives/default-header-bg.jpg';

    return (
      <div className='PublicGroup'>

        <Notification />

        <section className='PublicGroupHero relative px2 bg-black bg-cover white' style={{backgroundImage: `url(${collectiveBg})`}}>
          <div className='container relative center'>
            <PublicTopBarV2 className='pt3 absolute top-0 left-0 right-0' />
            <div className='PublicGroupHero-content'>
              <p className='h4 mt0 mb3 -ff-sec'>Hi! This is an <span className='-fw-bold'>OpenCollective</span> by <a href={group.website} className='underline white'>{group.name}</a> and we’re on a mission to&hellip;</p>
              <h1 className='PublicGroupHero-mission max-width-3 mx-auto mt0 mb4 white -ff-sec'>{group.description}</h1>
              <a className='mb3 -btn -btn-big -bg-green -ttu -ff-sec -fw-bold'>Be part of it!</a>
              <p className='h6'>Scroll down to find out more.</p>
              <svg width='14' height='9'>
                <use xlinkHref='#svg-arrow-down' stroke='#fff'/>
              </svg>
            </div>
          </div>

          <div className='PublicGroupHero-menu absolute left-0 right-0 bottom-0 xs-hide'>
            <nav>
              <ul className='list-reset m0 -ttu center'>
                <li className='inline-block'>
                  <a href="#who-we-are" className='block px2 py3 white -ff-sec -fw-bold'>Who we are</a>
                </li>
                <li className='inline-block'>
                  <a href="#why-join" className='block px2 py3 white -ff-sec -fw-bold'>Why join?</a>
                </li>
                <li className='inline-block'>
                  <a href="#expenses-and-activity" className='block px2 py3 white -ff-sec -fw-bold'>Expenses and Activity</a>
                </li>
                <li className='inline-block'>
                  <a href="#members-wall" className='block px2 py3 white -ff-sec -fw-bold'>Members Wall</a>
                </li>
                <li className='inline-block'>
                  <a href="#" className='block px2 py3 white -ff-sec -fw-bold'>Share</a>
                </li>
              </ul>
            </nav>
          </div>
        </section>

        <section id='who-we-are' className='PublicGroupHeader px2 bg-light-gray'>
          <div className='PublicGroupHeader-container container center'>
            <img className='PublicGroupHeader-logo rounded' src={group.logo ? group.logo : '/static/images/media-placeholder.svg'} />
            <h2 className='PublicGroupHeader-title m0 -ff-sec -fw-bold'>We are {group.name}</h2>
            <h3 className='mt0 mb2 -ff-sec -fw-light'>{group.description}</h3>
            <div className='PublicGroup-quote max-width-3 mx-auto'>
              <Markdown className='PublicGroup-quoteText' value={group.longDescription} />
            </div>

            {group.website ? (
              <div className='PublicGroupHeader-website pt3'>
                <a href={group.website} className='-btn -green -btn-outline -btn-small -ttu -ff-sec -fw-bold'>{displayUrl(group.website)}</a>
              </div>
            ) : null}

            {group.members.length ? (
              <div className='PublicGroup-members pt4'>
                <h3 className='mt0 mb2 -ff-sec -fw-light'>Core Contributors</h3>
                <div className='flex flex-wrap justify-center'>
                  {group.members.map((user, index) => <UserCard user={user} key={index} className='p3 m1' />)}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section id='why-join' className='bg-black white'>
          <div className='PublicGroupWhyJoin container clearfix md-flex'>
            <div className='col md-col-6 col-12 relative'>
              <div className='PublicGroup-Media-container'>
                <Media group={group} />
              </div>
            </div>
            <div className='PublicGroup-summary col md-col-6 col-12 px4 flex flex-column justify-between'>
              <div>
                <h2 className='white mt3 -ff-sec'>Why become a member?</h2>
                <p>With your membership plan, you’ll help us cover all expenses the collective makes in order to keep going. All the funds will be managed responsibly with your help, and everyone can see how and where the funds are being spent!</p>
              </div>
              <div className='PublicGroup-metricContainer flex py3'>
                <Metric label='Total Funds Available'
                  value={formatCurrency(group.balance, group.currency, {precision: 0})}
                  className='flex-auto pr2' />

                {(this.props.expenses.length) ? (
                  <div className='pt1 pl2'>
                    <a href='#' className='-btn -btn-outline -border-green -btn-small -ff-sec -fw-bold -ttu'>See how we’ve spent it</a>
                  </div>
                ) : null}
              </div>
              {/*
              <a className='Button Button--green PublicGroup-support' href='#support'>
                Back us
              </a>
              <div className='PublicGroup-share'>
                <ShareIcon type='twitter' url={shareUrl} name={group.name} description={group.description} />
                <ShareIcon type='facebook' url={shareUrl} name={group.name} description={group.description} />
                <ShareIcon type='mail' url={shareUrl} name={group.name} description={group.description} />
              </div>
              */}
            </div>
          </div>
        </section>

        <section className='bg-light-gray px2'>
          <div className='PublicGroupJoin-container container center'>
            <h2 className='m0 pb2 -ff-sec'>Join us and help fulfill our mission, month after month!</h2>
            <p className='m0 pb2'>With your membership plan, you’ll help us cover all the expenses the collective needs to keep going!</p>
            <div className='clearfix max-width-3 mx-auto pt3'>
              <div className='col md-col-6 col-12 px3 mb3'>
                <img width='125' height='98'
                  src='/static/images/collectives/join-supporter.png'
                  srcSet='/static/images/collectives/join-supporter@2x.png 2x'/>
                <h4>Become a member</h4>
                <p className='h5 m0'>Get your membership starting as low as of $1 a month! Help us continue our activities and you’ll get recognized on our <a href='#'>members wall</a>!</p>
              </div>
              <div className='col md-col-6 col-12 px3 mb3'>
                <img width='131' height='86'
                  src='/static/images/collectives/join-sponsor.png'
                  srcSet='/static/images/collectives/join-sponsor@2x.png 2x'/>
                <h4>Become a Sponsoring Member</h4>
                <p className='h5 m0'>Starting from $100 per month, you’ll become an oficial sponsor! We’ll proudly display your logo here and on our README on Github with a link to your site.</p>
              </div>
            </div>
          </div>
        </section>

        <section id='members-wall' className='bg-light-gray px2'>
          <div className='PublicGroupBackers container center'>
            <div className='container'>
              <div id='support'></div>
              <h2 className='m0 -ff-sec'>This is possible thanks to you.</h2>
              <p className='max-width-3 mx-auto'>Proud members and sponsors support this collective and allow us to keep going towards our mission. We would not be here if it weren’t for these amazing people. Thank you so much.</p>
              {this.donationSection()}
            </div>
          </div>
        </section>

        <section id='expenses-and-activity' className='px2'>
          <div className='container'>
            <div className='PublicGroup-transactions clearfix md-flex'>
              {this.expenseList()}
              {this.donationList()}
            </div>
          </div>
        </section>

        <PublicFooter />
      </div>
    );
  }

  componentDidMount() {
    const {
      group,
      fetchTransactions,
      fetchUsers,
      fetchGroup
    } = this.props;

    fetchGroup(group.id);

    fetchTransactions(group.id, {
      per_page: NUM_TRANSACTIONS_TO_SHOW,
      sort: 'createdAt',
      direction: 'desc',
      donation: true
    });

    fetchTransactions(group.id, {
      per_page: NUM_TRANSACTIONS_TO_SHOW,
      sort: 'createdAt',
      direction: 'desc',
      expense: true
    });

    fetchUsers(group.id);
  }

  componentWillMount() {
    const {
      decodeJWT,
      paypalIsDone,
      hasFullAccount
    } = this.props;

    // decode here because we don't handle auth on the server side yet
    decodeJWT();

    if (paypalIsDone) {
      this.refreshData();
      this.setState({
        showUserForm: !hasFullAccount,
        showThankYouMessage: hasFullAccount
      });
    }
  }

  // Used after a donation
  refreshData() {
    const {
      group,
      fetchGroup,
      fetchUsers,
      fetchTransactions
    } = this.props;

    return Promise.all([
      fetchGroup(group.id),
      fetchUsers(group.id),
      fetchTransactions(group.id, {
        per_page: NUM_TRANSACTIONS_TO_SHOW,
        sort: 'createdAt',
        direction: 'desc',
        donation: true
      })
    ]);
  }
}

export function donateToGroup({amount, frequency, currency, token, options}) {
  const {
    notify,
    donate,
    group
  } = this.props;

  const payment = {
    stripeToken: token && token.id,
    email: token && token.email,
    amount,
    currency
  };

  if (frequency === 'monthly') {
    payment.interval = 'month';
  } else if (frequency === 'yearly') {
    payment.interval = 'year';
  }

  return donate(group.id, payment, options)
    .then(() => {
      if (options && options.paypal) {
        // Paypal will redirect to this page and we will refresh at that moment
        return;
      }
        // stripe donation is immediate after the request
      return this.refreshData()
      .then(() => {
        this.setState({
          showUserForm: !this.props.hasFullAccount,
          showThankYouMessage: this.props.hasFullAccount
        });
      });
    })
    .catch((err) => notify('error', err.message));
}

export function saveNewUser() {
 const {
    newUser,
    updateUser,
    profileForm,
    validateSchema,
    notify,
    group,
    fetchUsers
  } = this.props;

  return validateSchema(profileForm.attributes, profileSchema)
    .then(() => updateUser(newUser.id, profileForm.attributes))
    .then(() => this.setState({
      showUserForm: false,
      showThankYouMessage: true
    }))
    .then(() => fetchUsers(group.id))
    .catch(({message}) => notify('error', message));
}

export default connect(mapStateToProps, {
  donate,
  notify,
  fetchTransactions,
  fetchUsers,
  fetchGroup,
  appendProfileForm,
  updateUser,
  validateSchema,
  decodeJWT,
  appendDonationForm
})(PublicGroup);

function mapStateToProps({
  groups,
  form,
  transactions,
  users,
  session,
  router
}) {
  const query = router.location.query;
  const newUserId = query.userid;
  const paypalUser = {
    id: query.userid,
    hasFullAccount: query.has_full_account === 'true'
  };

  const newUser = users.newUser || paypalUser;

  const group = values(groups)[0] || {stripeAccount: {}}; // to refactor to allow only one group
  const usersByRole = group.usersByRole || {};

  /* @xdamman:
   * We should refactor this. The /api/group route should directly return
   * group.host, group.backers, group.members, group.donations, group.expenses
   */
  group.id = Number(group.id);

  group.hosts = usersByRole[roles.HOST] || [];
  group.members = usersByRole[roles.MEMBER] || [];
  group.backers = usersByRole[roles.BACKER] || [];

  group.host = group.hosts[0] || {};

  group.backersCount = group.backers.length;
  group.transactions = filterCollection(transactions, { GroupId: group.id });

  const donations = transactions.isDonation;
  const expenses = transactions.isExpense;

  return {
    group,
    users,
    session,
    donations: take(sortBy(donations, txn => txn.createdAt).reverse(), NUM_TRANSACTIONS_TO_SHOW),
    expenses: take(sortBy(expenses, exp => exp.createdAt).reverse(), NUM_TRANSACTIONS_TO_SHOW),
    inProgress: groups.donateInProgress,
    // shareUrl: window.location.href,
    profileForm: form.profile,
    donationForm: form.donation,
    showUserForm: users.showUserForm || false,
    saveInProgress: users.updateInProgress,
    isAuthenticated: session.isAuthenticated,
    paypalIsDone: query.status === 'payment_success' && !!newUserId,
    newUser,
    hasFullAccount: newUser.hasFullAccount || false
  };
}
