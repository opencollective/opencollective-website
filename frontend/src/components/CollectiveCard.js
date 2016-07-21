import React, {Component, PropTypes} from 'react';

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

  mapCollectiveCardProps() {
    const { contributors, members, backers, yearlyIncome, currency } = this.props;

    const stats = [];
    if (contributors && Object.keys(contributors).length > 0)
      stats.push({ label: 'contributors', value: Object.keys(contributors).length });
    else
      stats.push({ label: 'members', value: members.length });

    stats.push({ label: 'backers', value: backers.length });
    stats.push({ label: 'yearly income', value: formatCurrency(yearlyIncome/100, currency, { compact: true, precision: 0 }) });

    return stats;
  }

  render() {
    const {key, bg, logo, name, description, url, className} = this.props;
    const stats = this.mapCollectiveCardProps();

    if (stats.length === 2)
      stats.unshift({label: '', value: ''});

    return (
      <div className={`CollectiveCard ${className}`}>
        <a href={url}>
          <div>
            <div className='CollectiveCard-head'>
              <div className='CollectiveCard-background' style={{backgroundImage: `url(${bg || DEFAULT_BG})`}}>
                <div className='CollectiveCard-image' style={{backgroundImage: `url(${logo || DEFAULT_LOGOS[key%DEFAULT_LOGOS.length]})`}}></div>
              </div>
            </div>
            <div className='CollectiveCard-body'>
              <div className='CollectiveCard-name'>{name}</div>
              <div className='CollectiveCard-description'>We are on a mission to {description}</div>
            </div>
            <div className='CollectiveCard-footer'>
              <div className='clearfix mt2'>
              { stats.map((stat) =>
                <div className='col col-4'>
                  <div className='CollectiveCard-metric'>
                    <div className='CollectiveCard-metric-value'>{stat.value}</div>
                    <div className='CollectiveCard-metric-label'>{stat.label}</div>
                  </div>
                </div>
              ) }
              </div>
            </div>
          </div>
        </a>
      </div>
    );
  }

}

CollectiveCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  logo: PropTypes.string,
  url: PropTypes.string
};