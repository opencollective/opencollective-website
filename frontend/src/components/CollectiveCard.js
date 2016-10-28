import React, {Component, PropTypes} from 'react';

import formatCurrency from '../lib/format_currency';
import { resizeImage, getGroupCustomStyles } from '../lib/utils';

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
    const { i18n, group } = this.props;

    const stats = [];
    if (group.contributorsCount)
      stats.push({ label: i18n.getString('coreContributors'), value: group.contributorsCount});
    else if (group.membersCount) {
      stats.push({ label: i18n.getString('members'), value: group.membersCount });
    }

    if (group.backersAndSponsorsCount) {
      stats.push({ label: i18n.getString('backers'), value: group.backersAndSponsorsCount });
    }

    stats.push({ label: i18n.getString('annualIncome'), value: formatCurrency(group.yearlyIncome/100, group.currency, { compact: true, precision: 0 }) });
    return stats;
  }

  mapCollectiveCardOnProfileProps() {
    const { group, i18n } = this.props;
    const stats = [];
    stats.push({label: i18n.getString('backers'), value: group.backersCount});
    stats.push({label: i18n.getString('sponsors'), value: group.sponsorsCount});
    stats.push({label: i18n.getString('annualIncome'), value: formatCurrency(group.yearlyIncome/100, group.currency, { compact: true, precision: 0 })});
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
    const { i18n, key, group, isSponsor } = this.props;

    const {
      backgroundImage,
      logo,
      name,
      description,
      mission,
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

    return (
      <div className={`CollectiveCard ${className}`}>
        <a href={publicUrl}>
          <div>
            <div className='CollectiveCard-head'>
              <div className='CollectiveCard-background' style={group.settings.style.hero.cover}></div>
              <div className='CollectiveCard-image' style={{backgroundImage: `url(${logo || DEFAULT_LOGOS[key%DEFAULT_LOGOS.length]})`}}></div>
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
