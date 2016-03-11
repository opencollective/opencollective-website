import React, { Component } from 'react';
import { connect } from 'react-redux';

import PublicTopBar from '../containers/PublicTopBar';
import PublicFooter from '../components/PublicFooter';

import Currency from '../components/Currency';

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
                <th className='Leaderboard-group-name' colSpan="2"> Collective </th>
                <th className='Leaderboard-donations'> Donations </th>
                <th className='Leaderboard-amount'> Amount raised </th>
                <th className='Leaderboard-last'> Last Donation Date </th>
              </tr>
              </thead>
              <tbody>
              {this.props.leaderboard.map(group => {
                const divStyle = {
                  backgroundImage: `url(${group.logo})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center'
                };
                return (
                  <tr>
                    <td className='Leaderboard-group-logo' style={divStyle} />
                    <td className='Leaderboard-group-name'> <a href={`/${group.slug}`}>{group.name} </a></td>
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
            Notes:
            <ol>
              <li>All stats are trailing 30-days.</li>
              <li>Our sorting doesn't account for currencies yet. WIP! </li>
            </ol>

          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

}

export default connect(mapStateToProps, {
})(Leaderboard);

function mapStateToProps({
  groups
}) {

  return {
    leaderboard: groups.leaderboard || []
  };
}
