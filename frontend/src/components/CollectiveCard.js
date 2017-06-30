import React, {Component, PropTypes} from 'react';

import formatCurrency from '../lib/format_currency';
import { resizeImage, getGroupCustomStyles } from '../lib/utils';

const DEFAULT_LOGOS = [
  '/public/images/code.svg',
  '/public/images/rocket.svg',
  '/public/images/repo.svg',
];

export default class CollectiveCard extends Component {

  constructor(props) {
    super(props);
  }

  mapCollectiveCardProps() {
    const { i18n, group } = this.props;
    const stats = [];

    if (group.backersAndSponsorsCount) {
      stats.push({ label: i18n.getString('backers'), value: group.backersAndSponsorsCount });
    } else {
      if (group.contributorsCount)
        stats.push({ label: i18n.getString('contributors'), value: group.contributorsCount});
      else if (group.membersCount) {
        stats.push({ label: i18n.getString('members'), value: group.membersCount });
      }      
    }

    stats.push({ label: i18n.getString('annualBudget'), value: formatCurrency(group.yearlyBudget, group.currency, { compact: true, precision: 0 }) });
    return stats;
  }

  mapCollectiveCardOnProfileProps() {
    const { group, i18n } = this.props;
    const stats = [];
    stats.push({label: i18n.getString('backers'), value: group.backersCount});
    stats.push({label: i18n.getString('sponsors'), value: group.sponsorsCount});
    stats.push({label: i18n.getString('annualBudget'), value: formatCurrency(group.yearlyBudget, group.currency, { compact: true, precision: 0 })});
    return stats;
  }

  mapSponsorsCardProps() {
    const { collectives, totalDonations, currency } = this.props.group;

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
    const { group, isSponsor, target, style } = this.props;

    const {
      backgroundImage,
      logo,
      index,
      name,
      publicUrl,
      isCollectiveOnProfile
    } = this.props.group;

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

    group.settings = group.settings || {};
    group.settings.style = getGroupCustomStyles(group);
    if (backgroundImage) {
      group.settings.style.hero.cover.backgroundImage = `url(${resizeImage(backgroundImage, { width: 320 })})`;
    }

    const description = group.mission || group.description;

    const defaultLogo = DEFAULT_LOGOS[index || Math.floor(Math.random() * DEFAULT_LOGOS.length)];

    return (
      <div className={`CollectiveCard ${className} ${style}`}>
        <a href={publicUrl} target={target}>
          <div>
            <div className='CollectiveCard-head'>
              <div className='CollectiveCard-background' style={group.settings.style.hero.cover}></div>
              <div className='CollectiveCard-image' style={{backgroundImage: `url(${logo || defaultLogo})`}}></div>
            </div>
            <div className='CollectiveCard-body'>
              <div className='CollectiveCard-name'>{name}</div>
              <div className='CollectiveCard-description'>{description}</div>
            </div>
            <div className='CollectiveCard-footer'>
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
        </a>
      </div>
    );
  }

}

CollectiveCard.propTypes = {
  group: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  index: PropTypes.number,
  target: PropTypes.string,
  style: PropTypes.string,
  isSponsor: PropTypes.boolean
};

CollectiveCard.defaultProps = {
  target: '_top',
  group: {
    amount: 0,
    currency: 'USD',
    interval: '',
    tier: ''
  }
};