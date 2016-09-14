import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import LoginTopBar from './LoginTopBar';
import Notification from './Notification';

import Input from '../components/Input';
import PublicFooter from '../components/PublicFooter';
import UserCard from '../components/UserCard';

import fetchTierList from '../actions/groups/fetch_tier_list';
import notify from '../actions/notification/notify';

export class GroupTierList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
    };
  }

  componentDidMount() {
    const { fetchTierList, group, tier } = this.props;
    fetchTierList(group.id, tier)
    .catch(({message}) => notify('error', message));
  }

  render() {
    const { i18n, tierList, tier } = this.props;
    const { searchQuery } = this.state;
    const lcSearchQuery = searchQuery.toLowerCase().trim();
    const filteredTierList = !lcSearchQuery ? tierList : tierList.filter(user => {
      const lcName = user.name.toLowerCase();
      return lcName.indexOf(lcSearchQuery) !== -1;
    });
    return (
      <div className='GroupTierList'>
          <LoginTopBar />
          <Notification />
          <div className='GroupTierList-container'>
            <div className='input-container'>
              <label></label>
              <Input
                placeholder='Search by Name'
                value={searchQuery}
                handleChange={value => this.setState({searchQuery: value})} />
            </div>
            <div className='UserCard-container'>
              {tierList && filteredTierList.map(user => <UserCard key={user.id} user={user} i18n={i18n} />)}
              {(tierList && Boolean(tierList.length) && filteredTierList.length === 0) && (
                <div className='GroupTierList-empty'>There are no users with the name: <strong>{searchQuery}</strong></div>
              )}
              {(!tierList || tierList.length === 0) && (
                <div className='GroupTierList-empty'>There are no <strong>{tier}</strong> in this collective.</div>
              )}
            </div>
          </div>
          <PublicFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, {
  fetchTierList,
  notify,
})(GroupTierList);

function mapStateToProps({ groups, router }) {
  // Instead of an array, a object is returned with the `tierList` as a property, and
  // the current group as the property `1` (instead of index zero like when it is an array, which is odd)
  // Since I am not confident of what will be the index number, the following line is index-agnostic
  const group = groups[Object.keys(groups).filter(k => !isNaN(k))[0]];
  const { slug, tier } = router.params;
  return {
    i18n: i18n('en'),
    tierList: groups.tierList,
    group,
    slug,
    tier
  }
}
