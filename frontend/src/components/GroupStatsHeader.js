import React, {Component, PropTypes} from 'react';

import formatCurrency from '../lib/format_currency';

export default class GroupStatsHeader extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { group, i18n } = this.props;
    group.usersCount = (group.users) ? group.users.length - 1 : group.backersCount;
    group.contributorsCount = (group.data && group.data.githubContributors) ? Object.keys(group.data.githubContributors).length : 0;

    const yearlyIncome = group.yearlyIncome / 100;
    const formattedYearlyIncome = yearlyIncome && formatCurrency(yearlyIncome, group.currency, { compact: true, precision: 0 });

    const totalMembers = group.contributorsCount + group.usersCount;

    const plural = totalMembers > 1 ? 's' : '';

    const counterString = ` ${totalMembers} ${i18n.getString(`contributor${plural}`)}`;

    return (
      <div className='GroupStatsHeader-backer-statistics'>
        <div className='GroupStatsHeader-backer-count-text'>
          {i18n.getString('weHave')}
          {counterString}
          {yearlyIncome > 0 && ` ${i18n.getString('and')} ${i18n.getString('aYearlyBudgetOf')}`}
        </div>
        {yearlyIncome > 0 && (
            <div className='GroupStatsHeader-backer-yearly-budget'>
              {formattedYearlyIncome.split('').map((character) => <span className={/[^0-9]/.test(character) ? '-character' : '-digit'}>{character}</span>)}
            </div>
          )
        }
      </div>
    );
  }
}

GroupStatsHeader.propTypes = {
  group: PropTypes.object.isRequired,
  i18n: PropTypes.func.isRequired
};
