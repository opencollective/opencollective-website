import React, {Component, PropTypes} from 'react';

import formatCurrency from '../lib/format_currency';
import filterCollection from '../lib/filter_collection';

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
    const {
      contributors,
      members,
      backers,
      yearlyIncome,
      currency,
      i18n
    } = this.props;

    const stats = [];
    if (contributors && Object.keys(contributors).length > 0)
      stats.push({ label: i18n.getString('coreContributors'), value: Object.keys(contributors).length });
    else if (members && Object.keys(members).length > 0) {
      stats.push({ label: i18n.getString('members'), value: members.length });
    } else {
      stats.push({ label: ' ', value: ' '});
    }

    if (backers && Object.keys(backers).length > 0) {
      stats.push({ label: i18n.getString('backers'), value: backers.length });
    }

    stats.push({ label: i18n.getString('annualIncome'), value: formatCurrency(yearlyIncome/100, currency, { compact: true, precision: 0 }) });
    return stats;
  }

  mapCollectiveCardOnProfileProps() {
    const { backers, yearlyIncome, currency, i18n } = this.props;
    const sponsorsCount = filterCollection(backers, {tier: 'sponsor'}).length;
    const stats = [];
    stats.push({label: i18n.getString('backers'), value: backers.length - sponsorsCount});
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
  };

  render() {
    const {
      key,
      backgroundImage,
      logo,
      name,
      description,
      mission,
      publicUrl,
      className,
      i18n,
      isSponsor,
      isCollectiveOnProfile
    } = this.props;

    let stats = [];

    if (isSponsor) {
      stats = this.mapSponsorsCardProps();
    } else if (isCollectiveOnProfile) {
      stats = this.mapCollectiveCardOnProfileProps();
    } else {
      stats = this.mapCollectiveCardProps();
    }

    if (stats.length == 2)
      stats.unshift({label: ' ', value: ' '});

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
                <div key={stat.label} className='col col-4'>
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