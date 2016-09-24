import React, { Component } from 'react';
import { connect } from 'react-redux';

import sortBy from 'lodash/sortBy';
import take from 'lodash/take';
import values from 'lodash/values';

import filterCollection from '../lib/filter_collection';
import i18n from '../lib/i18n';
import profileSchema from '../joi_schemas/profile';
import roles from '../constants/roles';
import { canEditGroup } from '../lib/admin';

import appendDonationForm from '../actions/form/append_donation';
import appendProfileForm from '../actions/form/append_profile';
import decodeJWT from '../actions/session/decode_jwt';
import donate from '../actions/groups/donate';
import fetchGroup from '../actions/groups/fetch_by_id';
import fetchProfile from '../actions/profile/fetch_by_slug';
import fetchTransactions from '../actions/transactions/fetch_by_group';
import fetchUsers from '../actions/users/fetch_by_group';
import getSocialMediaAvatars from '../actions/users/get_social_media_avatars';
import notify from '../actions/notification/notify';
import updateUser from '../actions/users/update';
import uploadImage from '../actions/images/upload';
import validateSchema from '../actions/form/validate_schema';

import Notification from './Notification';

import PublicGroupContributors from '../components/public_group/PublicGroupContributors';
import PublicGroupExpensesAndActivity from '../components/public_group/PublicGroupExpensesAndActivity';
import PublicGroupHero from '../components/public_group/PublicGroupHero';
import PublicGroupJoinUs from '../components/public_group/PublicGroupJoinUs';
import PublicGroupMembersWall from '../components/public_group/PublicGroupMembersWall';
import PublicGroupOpenSourceCTA from '../components/public_group/PublicGroupOpenSourceCTA';
import PublicGroupPending from '../components/public_group/PublicGroupPending';
import PublicGroupSignupV2 from '../components/public_group/PublicGroupSignupV2';
import PublicGroupThanksV2 from '../components/public_group/PublicGroupThanksV2';
import PublicGroupWhoWeAre from '../components/public_group/PublicGroupWhoWeAre';
import PublicGroupWhyJoin from '../components/public_group/PublicGroupWhyJoin';
import PublicGroupApplyToManageFunds from '../components/public_group/PublicGroupApplyToManageFunds';

import PublicFooter from '../components/PublicFooter';
import RelatedGroups from '../components/RelatedGroups';

// Number of expenses and revenue items to show on the public page
const NUM_TRANSACTIONS_TO_SHOW = 3;
const FETCH_DONATIONS_OPTIONS = {
  per_page: NUM_TRANSACTIONS_TO_SHOW,
  sort: 'createdAt',
  direction: 'desc',
  donation: true
};
const FETCH_EXPENSES_OPTIONS = {
  per_page: NUM_TRANSACTIONS_TO_SHOW,
  sort: 'createdAt',
  direction: 'desc',
  exclude: 'fees',
  expense: true
};
const DEFAULT_GROUP_SETTINGS = {
  lang: 'en',
  formatCurrency: {
    compact: false,
    precision: 2
  }
};
const DEFAULT_GROUP_TIERS = [{
  name: 'backer',
  title: 'Backers',
  description: 'Support us with a monthly donation and help us continue our activities.',
  presets: [1, 5, 10, 50, 100],
  range: [1, 1000000],
  interval: 'monthly',
  button: 'Become a backer'
}];
// Formats results for `ContributorList` component
// Sorts results, giving precedence to `core` Boolean first, then Number of `commits`
const formatGithubContributors = (githubContributors) => {
  return Object.keys(githubContributors).map(username => {
    const commits = githubContributors[username];
    return {
      core: false,
      name: username,
      avatar: `https://avatars.githubusercontent.com/${ username }?s=64`,
      stats: {
        c: commits,
        a: null,
        d: null,
      }
    }
  }).sort((A, B) => (B.core * Number.MAX_SAFE_INTEGER + B.stats.c) - (A.core * Number.MAX_SAFE_INTEGER + A.stats.c));
};

export class PublicGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showThankYouMessage: false,
      showUserForm: false
    };
    this.donateToGroupRef = donateToGroup.bind(this);
    this.closeDonationFlowRef = this.closeDonationFlow.bind(this);
    this.saveNewUserRef = saveNewUser.bind(this);
  }

  render() {
    const {
      donations,
      expenses,
      group,
      hasHost,
      canEditGroup
    } = this.props;

    // `false` if there are no `group.data.githubContributors`
    const contributors = (group.data && group.data.githubContributors) && formatGithubContributors(group.data.githubContributors);

    if (group.settings.pending) {
      return <PublicGroupPending group={ group } donateToGroup={ this.donateToGroupRef } {...this.props} />
    }

    return (
      <div className={`PublicGroup ${ group.slug }`}>
        <Notification />
        <PublicGroupHero group={ group } {...this.props} />
        <PublicGroupWhoWeAre group={ group } {...this.props} />

        {group.slug === 'opensource' && <PublicGroupOpenSourceCTA />}

        {contributors && <PublicGroupContributors contributors={ contributors } />}

        {group.slug !== 'opensource' && hasHost && <PublicGroupWhyJoin group={ group } expenses={ expenses } {...this.props} />}

        <div className='bg-light-gray px2'>
          {hasHost && <PublicGroupJoinUs {...this.props} donateToGroup={this.donateToGroupRef} {...this.props} />}
          {!hasHost && canEditGroup && <PublicGroupApplyToManageFunds {...this.props} />}
          <PublicGroupMembersWall group={group} {...this.props} />
        </div>
        {hasHost &&
          <PublicGroupExpensesAndActivity
            group={ group }
            expenses={ expenses }
            donations={ donations }
            itemsToShow={ NUM_TRANSACTIONS_TO_SHOW }
            {...this.props} /> }

        <section id='related-groups' className='px2'>
          <RelatedGroups groupList={ group.related } {...this.props} />
        </section>
        <PublicFooter />
        {this.renderDonationFlow()}
      </div>
    )
  }

  renderDonationFlow() {
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
            closeDonationModal={ this.closeDonationFlowRef } />
          <section className='pt4 center'>
            <RelatedGroups title={i18n.getString('checkOutOtherSimilarCollectives')} groupList={group.related} {...this.props} />
          </section>
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

  componentDidMount() {
    const {
      group,
      fetchTransactions,
      fetchUsers,
      fetchGroup
    } = this.props;

    return Promise.all([
      fetchGroup(group.id),
      fetchTransactions(group.id, FETCH_DONATIONS_OPTIONS),
      fetchTransactions(group.id, FETCH_EXPENSES_OPTIONS),
      fetchUsers(group.id)
    ])
  }

  componentWillMount() {
    const {
      paypalIsDone,
      hasFullAccount,
      slug,
      fetchProfile,
      loadData
    } = this.props;

    if (paypalIsDone) {
      this.refreshData();
      this.setState({
        showUserForm: !hasFullAccount,
        showThankYouMessage: hasFullAccount
      });
    }

    if (loadData) {
      fetchProfile(slug);
    }
  }

  closeDonationFlow() {
    this.setState({
      showThankYouMessage: false,
      showUserForm: false
    });
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
      fetchTransactions(group.id, FETCH_DONATIONS_OPTIONS)
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
      // Paypal will redirect to this page and we will refresh at that moment.
      // A Stripe donation on the other hand is immediate after the request:
      if (!(options && options.paypal)) {
        return this.refreshData()
        .then(() => {
          this.setState({
            showUserForm: !this.props.hasFullAccount,
            showThankYouMessage: this.props.hasFullAccount
          });
        });
      }
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
  appendDonationForm,
  fetchProfile
})(PublicGroup);

function mapStateToProps({
  groups,
  form,
  transactions,
  users,
  session,
  router,
  app
}) {
  const { query } = router.location;
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
  group.tiers = group.tiers || DEFAULT_GROUP_TIERS;
  group.settings = group.settings || DEFAULT_GROUP_SETTINGS;

  const donations = transactions.isDonation;
  const expenses = transactions.isExpense;

  return {
    group,
    users,
    session,
    donations: take(sortBy(donations, txn => txn.createdAt).reverse(), NUM_TRANSACTIONS_TO_SHOW),
    expenses: take(sortBy(expenses, exp => exp.createdAt).reverse(), NUM_TRANSACTIONS_TO_SHOW),
    inProgress: groups.donateInProgress,
    profileForm: form.profile,
    donationForm: form.donation,
    showUserForm: users.showUserForm || false,
    saveInProgress: users.updateInProgress,
    isAuthenticated: session.isAuthenticated,
    paypalIsDone: query.status === 'payment_success' && !!newUserId,
    newUser,
    hasFullAccount: newUser.hasFullAccount || false,
    i18n: i18n(group.settings.lang || 'en'),
    slug: router.params.slug,
    loadData: app.rendered,
    isSupercollective: group.isSupercollective,
    hasHost: group.hosts.length === 0 ? false : true,
    canEditGroup: canEditGroup(session, group)
  };
}
