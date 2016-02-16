import React, { Component } from 'react';

import { connect } from 'react-redux';

import roles from '../constants/roles';
import PublicTopBar from '../components/PublicTopBar';
import Notification from '../components/Notification';
import PublicFooter from '../components/PublicFooter';
import PublicGroupForm from '../components/PublicGroupForm';
import PublicGroupThanks from '../components/PublicGroupThanks';
import TransactionItem from '../components/TransactionItem';
import YoutubeVideo from '../components/YoutubeVideo';
import Metric from '../components/Metric';
import UsersList from '../components/UsersList';
import ShareIcon from '../components/ShareIcon';
import Icon from '../components/Icon';
import DisplayUrl from '../components/DisplayUrl';
import PublicGroupSignup from '../components/PublicGroupSignup';
import Markdown from '../components/Markdown';

import logout from '../actions/session/logout';

export class Subscriptions extends Component {
  render() {
    return (
      <div className='PublicGroup'>

        <PublicTopBar session={this.props.session} logout={this.props.logout}/>

        <div className='PublicContent'>
          SHIT
        </div>
        <PublicFooter />
      </div>
    );
  }

  componentWillMount() {

  }
}

export default connect(mapStateToProps, {
  logout
})(Subscriptions);

function mapStateToProps({
  session
}) {
  return {
    session
  };
}
