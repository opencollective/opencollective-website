import React, {Component, PropTypes} from 'react';

import formatCurrency from '../lib/format_currency';

/* eslint-disable */
const DEFAULT_BG = require('../assets/images/collectives/default-header-bg.jpg');
const DEFAULT_LOGOS = [
  require('../assets/images/code.svg'),
  require('../assets/images/rocket.svg'),
  require('../assets/images/repo.svg')
];
/* eslint-enable */

export default class CollectiveCard extends Component {

  constructor(props) {
    super(props);
  }

  mapCollectiveCardProps() {
    const {
      contributorsCount,
      membersCount,
      backersAndSponsorsCount,
      yearlyIncome,
      currency,
      i18n
    } = this.props;

    const stats = [];
    if (contributorsCount)
      stats.push({ label: i18n.getString('coreContributors'), value: contributorsCount});
    else if (membersCount) {
      stats.push({ label: i18n.getString('members'), value: membersCount });
    }

    if (backersAndSponsorsCount) {
      stats.push({ label: i18n.getString('backers'), value: backersAndSponsorsCount });
    }

    stats.push({ label: i18n.getString('annualIncome'), value: formatCurrency(yearlyIncome/100, currency, { compact: true, precision: 0 }) });
    return stats;
  }

  mapCollectiveCardOnProfileProps() {
    const { backersCount, sponsorsCount, yearlyIncome, currency, i18n } = this.props;
    const stats = [];
    stats.push({label: i18n.getString('backers'), value: backersCount});
    stats.push({label: i18n.getString('sponsors'), value: sponsorsCount});
    stats.push({label: i18n.getString('annualIncome'), value: formatCurrency(yearlyIncome/100, currency, { compact: true, precision: 0 })});
    return stats;
  }

  mapSponsorsCardProps() {
    const { collectives, totalDonations, currency } = this.props;

    const stats = [
      {
        label: ' ',
        value: ' '
      },{
        label: 'collectives',
        value: collectives
      },{
        label: 'donations',
        value: formatCurrency(totalDonations, currency, { compact: true, precision: 0 })
      }];
    return stats;
  }

  render() {
    const {
      key,
      backgroundImage,
      logo,
      name,
      description,
      mission,
      publicUrl,
      i18n,
      isSponsor,
      isCollectiveOnProfile
    } = this.props;

    let stats = [];
    let className = '';

    if (isSponsor) {
      className = 'sponsor';
      stats = this.mapSponsorsCardProps();
    } else if (isCollectiveOnProfile) {
      stats = this.mapCollectiveCardOnProfileProps();
    } else {
      stats = this.mapCollectiveCardProps();
    }

    return (
      <div className={`CollectiveCard ${className}`}>
        <a href={publicUrl}>
          <div>
            <div className='CollectiveCard-head'>
              <div className='CollectiveCard-background' style={{backgroundImage: `url(${backgroundImage || DEFAULT_BG})`}}>
                <div className='CollectiveCard-image' style={{backgroundImage: `url(${logo || DEFAULT_LOGOS[key%DEFAULT_LOGOS.length]})`}}></div>
              </div>
            </div>
            <div className='CollectiveCard-body'>
              <div className='CollectiveCard-name'>{name}</div>
              <div className='CollectiveCard-description'>{i18n.getString('missionTo')} {mission || description}</div>
            </div>
            <div className='CollectiveCard-footer'>
              <div className='clearfix mt2'>
              { stats.map((stat) =>
                <div key={stat.label} className={`col col-${12/(stats.length||1)}`}>
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
