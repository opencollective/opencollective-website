import React, {Component, PropTypes} from 'react';

import formatCurrency from '../../lib/format_currency';

export default class CollectiveStatsHeader extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { collective, i18n } = this.props;

    const yearlyIncome = collective.yearlyIncome;
    const formattedYearlyIncome = yearlyIncome && formatCurrency(yearlyIncome, collective.currency, { compact: true, precision: 0 });

    if (yearlyIncome <= 0) {
      return (<div />);
    }

    return (
      <div className='CollectiveStatsHeader-backer-statistics'>
        <div className='CollectiveStatsHeader-backer-count-text'>
          {i18n.getString('aYearlyBudgetOf')}
        </div>
        {yearlyIncome > 0 && (
            <div className='CollectiveStatsHeader-backer-yearly-budget'>
              {formattedYearlyIncome.split('').map((character) => <span className={/[^0-9]/.test(character) ? '-character' : '-digit'}>{character}</span>)}
            </div>
          )
        }
        {collective.collectivesCount > 1 && ` ${i18n.getString('across')} ${collective.collectivesCount} ${i18n.getString('collectives')}` }
      </div>
    );
  }
}

CollectiveStatsHeader.propTypes = {
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};
