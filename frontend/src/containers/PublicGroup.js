import React, { Component } from 'react';
import { connect } from 'react-redux';
import Promise from 'bluebird';

import { StickyContainer } from 'react-sticky';

import merge from 'lodash/merge';

import filterCollection from '../lib/filter_collection';
import i18nlib from '../lib/i18n';
import profileSchema from '../joi_schemas/profile';
import editGroupSchema from '../joi_schemas/editGroup';
import roles from '../constants/roles';
import { canEditGroup } from '../lib/admin';
import processMarkdown from '../lib/process_markdown';

import appendDonationForm from '../actions/form/append_donation';
import appendProfileForm from '../actions/form/append_profile';
import decodeJWT from '../actions/session/decode_jwt';
import donate from '../actions/groups/donate';
import fetchGroup from '../actions/groups/fetch_by_slug';
import fetchProfile from '../actions/profile/fetch_by_slug';
import fetchExpenses from '../actions/expenses/fetch_by_group';
import fetchDonations from '../actions/donations/fetch_by_group';
import fetchUsers from '../actions/users/fetch_by_group';
import getSocialMediaAvatars from '../actions/users/get_social_media_avatars';
import notify from '../actions/notification/notify';
import updateUser from '../actions/users/update';
import uploadImage from '../actions/images/upload';
import validateSchema from '../actions/form/validate_schema';
import updateGroup from '../actions/groups/update';
import appendEditGroupForm from '../actions/form/append_edit_group';
import cancelEditGroupForm from '../actions/form/cancel_edit_group';

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

import EditTopBar from '../components/edit_collective/EditCollectiveTopBar';

import PublicFooter from '../components/PublicFooter';
import RelatedGroups from '../components/RelatedGroups';

import { getGroupCustomStyles } from '../lib/utils';

// Number of expenses and revenue items to show on the public page
const NUM_TRANSACTIONS_TO_SHOW = 3;

const DEFAULT_GROUP_SETTINGS = {
  lang: 'en',
  formatCurrency: {
    compact: false,
    precision: 2
  }
};

// Formats results for `ContributorList` component
// Sorts results, giving precedence to `core` Boolean first, then Number of `commits`
const formatGithubContributors = (githubContributors) => {
  return Object.keys(githubContributors).map(username => {
    const commits = githubContributors[username];
    return {
      core: false,
      name: username,
      avatar: `https://avatars.githubusercontent.com/${ username }?s=64`,
      href: `https://github.com/${username}`,
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
    this.saveGroupRef = saveGroup.bind(this);
    this.cancelGroupEditsRef = onCancelGroupEdits.bind(this);
  }

  render() {
    const {
      group,
      hasHost,
      canEditGroup,
      editingInProgress,
      i18n
    } = this.props;

    if (group.settings.pending) {
      return <PublicGroupPending group={ group } donateToGroup={ this.donateToGroupRef } {...this.props} />
    }

    return (
      <div className={`PublicGroup ${ group.slug }`}>
        <Notification />
        <StickyContainer>
          {editingInProgress && <EditTopBar onSave={ this.saveGroupRef } onCancel={ this.cancelGroupEditsRef }/>}
          <PublicGroupHero group={ group } {...this.props} />
          <PublicGroupWhoWeAre group={ group } {...this.props} />

          {group.slug === 'opensource' && <PublicGroupOpenSourceCTA />}

          {group.members.length > 0 && <PublicGroupMembersWall group={group} {...this.props} />}
          {group.contributors && <PublicGroupContributors contributors={ group.contributors } i18n={i18n} />}

          {hasHost && group.whyJoin && <PublicGroupWhyJoin group={ group } {...this.props} />}

          <div className='bg-light-gray px2'>
            {hasHost && <PublicGroupJoinUs {...this.props} donateToGroup={this.donateToGroupRef} {...this.props} />}
            {!hasHost && canEditGroup && <PublicGroupApplyToManageFunds {...this.props} />}
          </div>
          {hasHost &&
            <PublicGroupExpensesAndActivity
              group={ group }
              itemsToShow={ NUM_TRANSACTIONS_TO_SHOW }
              {...this.props} /> }

          {hasHost &&
            <section id='related-groups' className='px2'>
              <RelatedGroups groupList={ group.related } {...this.props} />
            </section> }
          <PublicFooter />
          {this.renderDonationFlow()}
        </StickyContainer>
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
      fetchExpenses,
      fetchDonations,
      fetchUsers,
      fetchGroup
    } = this.props;

    if (!group.name) fetchGroup(group.slug);
    if (!group.usersByRole) fetchUsers(group.slug);
    if (!group.expenses || group.expenses.length === 0) fetchExpenses(group.slug);
    if (!group.donations || group.donations.length === 0) fetchDonations(group.slug);
  }

  componentWillMount() {
    const {
      paypalIsDone,
      hasFullAccount,
    } = this.props;

    if (paypalIsDone) {
      this.refreshData();
      this.setState({
        showUserForm: !hasFullAccount,
        showThankYouMessage: hasFullAccount
      });
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
      fetchProfile,
      fetchUsers,
      fetchExpenses,
    } = this.props;

    return Promise.all([
      fetchProfile(group.slug),
      fetchExpenses(group.slug),
      fetchUsers(group.slug)
      ])
  }
}

export function donateToGroup({amount, frequency, currency, token, options}) {
  const {
    notify,
    group,
    donate,
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

  return donate(group.slug, payment, options)
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
    group,
    newUser,
    updateUser,
    profileForm,
    validateSchema,
    notify,
    fetchUsers
  } = this.props;

  return validateSchema(profileForm.attributes, profileSchema)
    .then(() => {
      const userData = Object.assign({}, profileForm.attributes);
      return updateUser(newUser.id, userData);
    })
    .then(() => this.setState({
      showUserForm: false,
      showThankYouMessage: true
    }))
    .then(() => fetchUsers(group.slug))
    .catch(({message}) => notify('error', message));
}

export function saveGroup() {
  const {
    group,
    updateGroup,
    groupForm,
    fetchProfile,
    cancelEditGroupForm,
    notify,
    validateSchema
  } = this.props;

  return validateSchema(groupForm.attributes, editGroupSchema)
    .then(() => updateGroup(group.slug, groupForm.attributes))
    .then(() => merge(group, groupForm.attributes)) // this is to prevent ui from temporarily reverting to old text
    .then(() => cancelEditGroupForm()) // clear out this form to prevent data issues on another page.
    .then(() => fetchProfile(group.slug))
    .then(() => notify('success', 'Group updated'))
    .catch(({message}) => notify('error', message));
}

export function onCancelGroupEdits() {
  const {
    cancelEditGroupForm
  } = this.props;

  cancelEditGroupForm();
}

export default connect(mapStateToProps, {
  donate,
  uploadImage,
  notify,
  fetchExpenses,
  fetchDonations,
  fetchUsers,
  fetchGroup,
  appendProfileForm,
  updateUser,
  getSocialMediaAvatars,
  validateSchema,
  decodeJWT,
  appendDonationForm,
  fetchProfile,
  updateGroup,
  appendEditGroupForm,
  cancelEditGroupForm
})(PublicGroup);

function mapStateToProps({
  groups,
  form,
  donations,
  expenses,
  users,
  session,
  router,
  app
}) {
  const { query } = router.location;
  const slug = router.params.slug.toLowerCase();

  const newUserId = query.userid;
  const paypalUser = {
    id: query.userid,
    hasFullAccount: query.has_full_account === 'true'
  };

  const newUser = users.newUser || paypalUser;
  const group = groups[slug] || {slug, stripeAccount: {}}; // to refactor to allow only one group
  const usersByRole = group.usersByRole || {};

  /* @xdamman:
   * We should refactor this. The /api/group route should directly return
   * group.host, group.backers, group.members, group.donations, group.expenses
   */
  group.id = Number(group.id);
  group.hosts = usersByRole[roles.HOST] || [];
  group.members = usersByRole[roles.MEMBER] || [];
  group.backers = usersByRole[roles.BACKER] || [];
  group.contributors = (group.data && group.data.githubContributors) ? formatGithubContributors(group.data.githubContributors) : [];

  group.host = group.hosts[0] || {};

  group.donations = filterCollection(donations, { GroupId: group.id });
  group.expenses = filterCollection(expenses, { GroupId: group.id });
  group.settings = group.settings || DEFAULT_GROUP_SETTINGS;

  const processedMarkdown = processMarkdown(group.longDescription);
  group.backgroundImage = processedMarkdown.params.cover || group.backgroundImage;
  group.logo = processedMarkdown.params.logo || group.logo;
  group.mission = processedMarkdown.params.mission || group.mission;
  group.website = processedMarkdown.params.website || group.website;
  group.settings.style = getGroupCustomStyles(group); 
  
  let button;
  if (processedMarkdown.params.button) {
    const tokens = processedMarkdown.params.button.match(/\[(.+)\]\((.+)\)/i);
    button = { label: tokens[1], href: tokens[2] };
  }

  const i18n = i18nlib(group.settings.lang || 'en');
  group.button = button || { label: i18n.getString('bePart'), href: '#support' };

  if (group.name && window.document)
    document.title = `${group.name} is on Open Collective`;

  return {
    group,
    users,
    session,
    inProgress: groups.donateInProgress,
    profileForm: form.profile,
    donationForm: form.donation,
    showUserForm: users.showUserForm || false,
    groupForm: form.editGroup,
    saveInProgress: users.updateInProgress,
    isAuthenticated: session.isAuthenticated,
    paypalIsDone: query.status === 'payment_success' && !!newUserId,
    newUser,
    hasFullAccount: newUser.hasFullAccount || false,
    i18n,
    loadData: app.rendered,
    isSupercollective: group.isSupercollective,
    hasHost: group.hosts.length === 0 ? false : true,
    canEditGroup: canEditGroup(session, group),
    editingInProgress: form.editGroup.inProgress
  };
}
