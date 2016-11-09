import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import formatCurrency from '../lib/format_currency';

export default class GroupStatsHeader extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { group, i18n } = this.props;
    group.usersCount = (group.users) ? _.uniqBy(group.users, 'id').length - 1 : group.backersCount;

    const yearlyIncome = group.yearlyIncome;
    const formattedYearlyIncome = yearlyIncome && formatCurrency(yearlyIncome, group.currency, { compact: true, precision: 0 });

    const totalMembers = group.contributorsCount + group.usersCount;

    const plural = totalMembers > 1 ? 's' : '';

    const counterString = ` ${totalMembers.toLocaleString()} ${i18n.getString(`contributor${plural}`)}`;

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
        {group.collectivesCount > 1 && ` ${i18n.getString('across')} ${group.collectivesCount} ${i18n.getString('collectives')}` }
      </div>
    );
  }
}

GroupStatsHeader.propTypes = {
  group: PropTypes.object.isRequired,
  i18n: PropTypes.func.isRequired
};
