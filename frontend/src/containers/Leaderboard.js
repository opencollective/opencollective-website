import React, { Component } from 'react';
import { connect } from 'react-redux';

import getLeaderboard from '../actions/groups/get_leaderboard';

export class Leaderboard extends Component {
  render() {
    return (
     <div className='Leaderboard'>
        {this.props.leaderboard.map(group => <div>{group.name}</div>)}
      </div>
    );
  }

  componentDidMount() {
    this.props.getLeaderboard();
  }
}

export default connect(mapStateToProps, {
  getLeaderboard
})(Leaderboard);

function mapStateToProps({
  groups
}) {

  return {
    leaderboard: groups.leaderboard || []
  };
}
