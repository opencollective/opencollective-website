import React, { Component } from 'react';

import { connect } from 'react-redux';
import take from 'lodash/array/take';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy';
import i18n from '../lib/i18n';
import filterCollection from '../lib/filter_collection';

import roles from '../constants/roles';
import Notification from '../containers/Notification';
import PublicFooter from '../components/PublicFooter';
import UserCard from '../components/UserCard';

import OnBoardingHeader from '../components/on_boarding/OnBoardingHeader';

import PublicGroupHero from '../components/public_group/PublicGroupHero';
import PublicGroupWhoWeAre from '../components/public_group/PublicGroupWhoWeAre';
import PublicGroupWhyJoin from '../components/public_group/PublicGroupWhyJoin';
import PublicGroupJoinUs from '../components/public_group/PublicGroupJoinUs';
import PublicGroupMembersWall from '../components/public_group/PublicGroupMembersWall';
import PublicGroupExpenses from '../components/public_group/PublicGroupExpenses';
import PublicGroupDonations from '../components/public_group/PublicGroupDonations';
import PublicGroupSignupV2 from '../components/public_group/PublicGroupSignupV2';
import PublicGroupThanksV2 from '../components/public_group/PublicGroupThanksV2';
import BackerCard from '../components/public_group/BackerCard';
import ContributorList from '../components/public_group/ContributorList';

import fetchGroup from '../actions/groups/fetch_by_id';
import fetchUsers from '../actions/users/fetch_by_group';
import fetchTransactions from '../actions/transactions/fetch_by_group';
import donate from '../actions/groups/donate';
import notify from '../actions/notification/notify';
import appendDonationForm from '../actions/form/append_donation';
import appendProfileForm from '../actions/form/append_profile';
import updateUser from '../actions/users/update';
import getSocialMediaAvatars from '../actions/users/get_social_media_avatars';
import validateSchema from '../actions/form/validate_schema';
import decodeJWT from '../actions/session/decode_jwt';
import uploadImage from '../actions/images/upload';

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

  _donationFlow() {
    const {
      isAuthenticated,
      showPaypalThankYou,
      i18n,
      group,
      newUser
    } = this.props;

    if (this.state.showThankYouMessage || (isAuthenticated && this.state.showUserForm) || showPaypalThankYou) {
      return (
        <div className='PublicGroupDonationFlowWrapper px2 py4 border-box fixed top-0 left-0 right-0 bottom-0'>
          <PublicGroupThanksV2
            message={i18n.getString('nowOnBackersWall')}
            i18n={i18n}
            group={group}
            newUserId={newUser.id}
            closeDonationModal={this._closeDonationFlow.bind(this)} />
        </div>
      );
    } else if (this.state.showUserForm) {
      return (
        <div className='PublicGroupDonationFlowWrapper px2 py4 border-box fixed top-0 left-0 right-0 bottom-0 bg-white'>
          <PublicGroupSignupV2 {...this.props} save={saveNewUser.bind(this)} />
        </div>
      );
    }

    return null;
  }

  _closeDonationFlow() {
    this.setState({
      showThankYouMessage: false,
      showUserForm: false
    });
  }

  renderPendingBackers() {
    const backers = [ // TODO: replace with current backers of pending collective
      { name: 'Ascari', tier: 'backer', avatar: 'https://avatars2.githubusercontent.com/u/2263170?s=96' }
    ];
    const backersCount = backers.length;
  
    if (backers.length < 10) {
      for (var i = 0, delta = 10 - backers.length; i < delta; i++) {
        backers.push(null)
      }
    }

    return (
      <div className="PublicGroup-backer-container">
        <div className="-top-gradient"></div>
        <div className="-wrap">
          {backers.map((backer, index) => {
            if (backer) {
              return <UserCard user={backer} {...this.props}/>
            } else {
              return (
                <BackerCard 
                  key={index}
                  title={`${index+1}st Backer`} 
                  user={{avatar: ''}}
                  onClick={index === (backersCount) ? () => { /* TODO Add a backer flow starts here */ } : null}
                />
              )
            }
          })}
        </div>
        <div className="mb4">
          <small style={{color: '#919699'}}>You won’t be charged a single penny until we reach our 10 backer goal. <a href="#">More info</a></small>
        </div>
        <div className="-bottom-gradient"></div>
      </div>
    )
  }

  renderPendingContributors() {
    const contributors = [ // TODO replace with contributors of opensource project
      {name: 'Xavier Damman', avatar: 'https://avatars.githubusercontent.com/xdamman?s=96', core: true},
      {name: 'Pia Mancini', avatar: 'https://avatars.githubusercontent.com/piamancini?s=96', core: true},
      {name: 'Sébastien Dubois', avatar: 'https://avatars.githubusercontent.com/sedubois?s=96', core: true},
      {name: 'Kristaps Ledins', avatar: 'https://avatars.githubusercontent.com/krysits?s=96'},
      {name: 'Ericku', avatar: 'https://avatars.githubusercontent.com/erickrico?s=96'},
      {name: 'Javier Bórquez', avatar: 'https://avatars.githubusercontent.com/javierbyte?s=96'},
      {name: 'Alvaro Cabrera Durán', avatar: 'https://avatars.githubusercontent.com/pateketrueke?s=96'},
      {name: 'Eduardo Lavaque', avatar: 'https://avatars.githubusercontent.com/greduan?s=96'},
      {name: 'dvaughan', avatar: 'https://avatars.githubusercontent.com/dsvaughan?s=96'},
      {name: 'Sergio de la Garza', avatar: 'https://avatars.githubusercontent.com/sgarza?s=96'},
      {name: 'Michael Anthony', avatar: 'https://avatars.githubusercontent.com/mcanthony?s=96'},
      {name: 'José Moreira', avatar: 'https://avatars.githubusercontent.com/cusspvz?s=96'},
      {name: 'eduardoalbertorg', avatar: 'https://avatars.githubusercontent.com/eduardoalbertorg?s=96'},
      {name: 'alfredopizana', avatar: 'https://avatars.githubusercontent.com/alfredopizana?s=96'},
      {name: 'Javier Murillo', avatar: 'https://avatars.githubusercontent.com/javiermurillo?s=96'},
      {name: 'Linnk Benavides', avatar: 'https://avatars.githubusercontent.com/Linnk?s=96'},
      {name: 'Adrián Zúñiga Espinoza', avatar: 'https://avatars.githubusercontent.com/Adrian0350?s=96'},
      {name: 'Ascari', avatar: 'https://avatars.githubusercontent.com/carlosascari?s=96'},
    ].map((contributor) => {
      contributor.stats = {
        c: ~~(Math.random() * 400),
        a: ~~(Math.random() * 4000),
        d: ~~(Math.random() * 999)
      };
      return contributor;
    });
    return (
      <div className="PublicGroup-contrib-container">
        <div className="line1" >Contributors</div>
        <ContributorList contributors={contributors} />
      </div>
    )
  }

  renderPendingAbout() {
    return (
      <div className="PublicGroup-about-container">
        <div className="line1">About Open Collective</div>
        <div className="line2">
          We use [Open Collective host] to collect the funds on our behalf using OpenCollective. Whenever we need to use the money for something, we will submit the invoice or expense via the OpenCollective app and once approved we will be reimbursed. That way, you can always track our budget. 
          <br/>
          <b>Everything is transparent.</b>
        </div>
        <div className="more-button">learn more</div>
      </div>
    ) 
  }

  renderPending() {
    const { group } = this.props;
    return (
      <div className='PublicGroup PublicGroup--inactive'>
        <OnBoardingHeader />
        <div className="PublicGroupHero-logo mb3 bg-contain" style={{backgroundImage: `url(${'https://cldup.com/U1yzUnB9YJ.png'})`}} ></div>
        <div className="line1">Help <a href={group.website}>{group.name}</a> create an open collective to…</div>
        <div className="line2">{group.mission}</div>
        <div className="line3">Help us get the first 10 backers to start the collective going.</div>
        <div className="line4">With at least $10 you can become a member and help us cover design work, maintenance and servers.</div>
        {this.renderPendingBackers()}
        <div className="line5">Thank you for your visit</div>
        <div className="line6">We are the contributors of this collective nice to meet you.</div>
        {this.renderPendingContributors()}
        {this.renderPendingAbout()}
        <PublicFooter />
      </div>
    )
  }

  render() {
    const {
      group,
      expenses,
      donations,
      users,
      // shareUrl,
    } = this.props;

    if (group.settings.pending) {
      return this.renderPending();
    }

    const publicGroupClassName = `PublicGroup ${group.slug}`;

    return (
      <div className={publicGroupClassName}>
        <Notification />

        <PublicGroupHero group={group} {...this.props} />
        <PublicGroupWhoWeAre group={group} {...this.props} />
        <PublicGroupWhyJoin group={group} expenses={expenses} {...this.props} />

        <div className='bg-light-gray px2'>
          <PublicGroupJoinUs {...this.props} donateToGroup={donateToGroup.bind(this)} {...this.props} />
          <PublicGroupMembersWall group={group} {...this.props} />
        </div>

        <section id='expenses-and-activity' className='px2'>
          <div className='container'>
            <div className='PublicGroup-transactions clearfix md-flex'>
              <PublicGroupExpenses group={group} expenses={expenses} users={users} itemsToShow={NUM_TRANSACTIONS_TO_SHOW} {...this.props} />
              <PublicGroupDonations group={group} donations={donations} users={users} itemsToShow={NUM_TRANSACTIONS_TO_SHOW} {...this.props} />
            </div>
          </div>
        </section>

        <PublicFooter />

        {this._donationFlow()}
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
      exclude: 'fees',
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
    currency,
    distribution: options && options.distribution
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
  uploadImage,
  notify,
  fetchTransactions,
  fetchUsers,
  fetchGroup,
  appendProfileForm,
  updateUser,
  getSocialMediaAvatars,
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
  group.tiers = group.tiers || [{
    name: 'backer',
    title: "Backers",
    description: "Support us with a monthly donation and help us continue our activities.",
    presets: [1, 5, 10, 50, 100],
    range: [1, 1000000],
    interval: 'monthly',
    button: "Become a backer"
  }];

  group.settings = group.settings || {
    lang: 'en',
    formatCurrency: {
      compact: false,
      precision: 2
    }
  };

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
    hasFullAccount: newUser.hasFullAccount || false,
    i18n: i18n(group.settings.lang || 'en')
  };
}
