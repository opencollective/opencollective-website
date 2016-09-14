import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import LoginTopBar from '../containers/LoginTopBar';

import Input from '../components/Input';
import PublicFooter from '../components/PublicFooter';
import UserCard from '../components/UserCard';

export class GroupTierList extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { i18n} = this.props;
    const user = {tier: 'backer', name: 'Ascari'};
    return (
      <div className='GroupTierList'>
          <LoginTopBar />
          <div className='GroupTierList-container'>
            <div className='input-container'>
              <label></label>
              <Input
                placeholder=''
                value=''
                handleChange={Function.prototype} />
            </div>
            <div className='UserCard-container'>
              <UserCard user={user} i18n={i18n} />
            </div>
          </div>
          <PublicFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(GroupTierList);

function mapStateToProps() {
  return {
    i18n: i18n('en'),
  }
}
