import React, { Component } from 'react';
import { connect } from 'react-redux';

import PublicTopBar from '../containers/PublicTopBar';
import PublicFooter from '../components/PublicFooter';

import Currency from '../components/Currency';

import getLeaderboard from '../actions/groups/get_leaderboard';


export class Leaderboard extends Component {
  render() {
    return (
      <div className='Leaderboard'>

        <PublicTopBar />

        <div className='PublicContent'>

          <div className='Leaderboard-header'>
            <h2> Open Collective Leaderboard </h2>
          </div>

          <div className='Leaderboard-data'>
            <table className='Leaderboard-table'>
              <thead>
              <tr className='Leaderboard-header-row'>
              <td className='Leaderboard-group-name'> Group </td>
              <td className='Leaderboard-donations'> Donations </td>
              <td className='Leaderboard-amount'> Amount raised </td>
              <td className='Leaderboard-last'> Last Donation Date </td>
              </tr>
              </thead>
              <tbody>
              {this.props.leaderboard.map(group => {
                return (
                  <tr>
                  <td className='Leaderboard-group-name'> {group.name} </td>
                  <td className='Leaderboard-donations'> {group.donationsCount} </td>
                  <td className='Leaderboard-amount'> <Currency value={group.totalAmount} currency={group.currency} /> </td>
                  <td className='Leaderboard-last'> {group.latestDonation} </td>
                  </tr>
                )}
              )}
              </tbody>
            </table>
          </div>
          <div className='Leaderboard-info'>
            *This page tracks trailing 30-day stats.
          </div>
        </div>
        <PublicFooter />
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
