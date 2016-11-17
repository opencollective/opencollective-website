import React, {Component, PropTypes} from 'react';

import formatCurrency from '../lib/format_currency';
import { resizeImage, getGroupCustomStyles } from '../lib/utils';

const DEFAULT_LOGOS = [
  '/static/images/code.svg',
  '/static/images/rocket.svg',
  '/static/images/repo.svg',
];

export default class SponsoredCard extends Component {

  render() {
    const { index, group, tier, className, interval, width } = this.props;

    const formattedAmount = formatCurrency(group.amount, group.currency, { compact: true, precision: 0 });
    const defaultLogo = DEFAULT_LOGOS[index || Math.floor(Math.random() * DEFAULT_LOGOS.length)];

    group.settings = group.settings || {};
    group.settings.style = getGroupCustomStyles(group);
    if (group.backgroundImage && !group.backgroundImage.match(/^\//)) {
      group.settings.style.hero.cover.backgroundImage = `url(${resizeImage(group.backgroundImage, { width: width * 2 || 320 })})`;
    }
    return (
      <div className={`SponsoredCard ${className}`}>
        <a href={group.publicUrl}>
          <div>
            <div className='SponsoredCard-head'>
              <div className='SponsoredCard-background' style={group.settings.style.hero.cover}></div>
              <div className='SponsoredCard-image' style={{backgroundImage: `url(${group.logo || defaultLogo})`}}></div>
            </div>
            <div className='SponsoredCard-body'>
              <div className='SponsoredCard-name'>{ group.name }</div>
            </div>
            <div className='SponsoredCard-footer'>
              {tier && <div className='SponsoredCard-type'>{ tier }</div> }
              {group.amount > 0 && <div className='SponsoredCard-amount'>{`${formattedAmount} ${interval}`}</div>}
            </div>
          </div>
        </a>
      </div>
    );
  }

}

SponsoredCard.propTypes = {
  group: PropTypes.object.isRequired,
  interval: PropTypes.string.isRequired,
  tier: PropTypes.string,
  index: PropTypes.number
};

SponsoredCard.defaultProps = {
  group: { 
    amount: 0,
    currency: 'USD',
    interval: '',
    tier: ''
  }
};
