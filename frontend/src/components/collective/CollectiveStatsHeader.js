import React, {Component, PropTypes} from 'react';

import formatCurrency from '../../lib/format_currency';

export default class CollectiveStatsHeader extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { collective, i18n } = this.props;

    const yearlyBudget = collective.yearlyBudget;
    const formattedYearlyBudget = yearlyBudget && formatCurrency(yearlyBudget, collective.currency, { compact: true, precision: 0 });

    if (yearlyBudget <= 0) {
      return (<div />);
    }

    return (
      <div className='CollectiveStatsHeader-backer-statistics'>
        <div className='CollectiveStatsHeader-backer-count-text'>
          {i18n.getString('aYearlyBudgetOf')}
        </div>
        {yearlyBudget > 0 && (
            <div className='CollectiveStatsHeader-backer-yearly-budget'>
              {formattedYearlyBudget.split('').map((character) => <span className={/[^0-9]/.test(character) ? '-character' : '-digit'}>{character}</span>)}
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
