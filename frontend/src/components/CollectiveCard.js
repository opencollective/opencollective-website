import React, {Component} from 'react';

import formatCurrency from '../lib/format_currency';

const DEFAULT_BG = '/static/images/collectives/default-header-bg.jpg';
const DEFAULT_LOGOS = [
  '/static/images/code.svg',
  '/static/images/rocket.svg',
  '/static/images/repo.svg',
];

export default class CollectiveCard extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {id, bg, logo, name, mission, backerCount, sponsorCount, monthlyIncome, currency} = this.props;
    const formattedMonthlyIncome = formatCurrency(monthlyIncome/100, currency, { compact: true, precision: 0 });
    return (
      <div className='CollectiveCard'>
        <div className='CollectiveCard-head'>
          <div className='CollectiveCard-background' style={{backgroundImage: `url(${bg || DEFAULT_BG})`}}>
            <div className='CollectiveCard-image' style={{backgroundImage: `url(${logo || DEFAULT_LOGOS[id%DEFAULT_LOGOS.length]})`}}></div>
          </div>
        </div>
        <div className='CollectiveCard-body'>
          <div className='CollectiveCard-name'>{name}</div>
          <div className='CollectiveCard-description'>{mission}</div>
        </div>
        <div className='CollectiveCard-footer'>
          <div className="clearfix mt2">
            <div className="col col-4">
              <div className='CollectiveCard-metric'>
                <div className='CollectiveCard-metric-value'>{backerCount}</div>
                <div className='CollectiveCard-metric-label'>backers</div>
              </div>
            </div>
            <div className="col col-4">
              <div className='CollectiveCard-metric'>
                <div className='CollectiveCard-metric-value'>{sponsorCount}</div>
                <div className='CollectiveCard-metric-label'>sponsors</div>
              </div>
            </div>
            <div className="col col-4">
              <div className='CollectiveCard-metric'>
                <div className='CollectiveCard-metric-value'>{formattedMonthlyIncome}</div>
                <div className='CollectiveCard-metric-label'>monthly&nbsp;income</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
