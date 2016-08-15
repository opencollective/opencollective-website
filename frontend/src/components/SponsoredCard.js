import React, {Component, PropTypes} from 'react';

import formatCurrency from '../lib/format_currency';

const DEFAULT_BG = '/static/images/collectives/default-header-bg.jpg';
const DEFAULT_LOGOS = [
  '/static/images/code.svg',
  '/static/images/rocket.svg',
  '/static/images/repo.svg',
];

export default class SponsoredCard extends Component {

  render() {
    const {
      amount,
      backgroundImage,
      className,
      currency,
      interval,
      key,
      logo,
      name,
      publicUrl,
      tier,
    } = this.props;

    const formattedAmount = formatCurrency(amount, currency, { compact: true, precision: 0 });

    return (
      <div className={`SponsoredCard ${className}`}>
        <a href={publicUrl}>
          <div>
            <div className='SponsoredCard-head'>
              <div className='SponsoredCard-background' style={{backgroundImage: `url(${backgroundImage || DEFAULT_BG})`}}>
                <div className='SponsoredCard-image' style={{backgroundImage: `url(${logo || DEFAULT_LOGOS[key%DEFAULT_LOGOS.length]})`}}></div>
              </div>
            </div>
            <div className='SponsoredCard-body'>
            	<div className='SponsoredCard-name'>{ name }</div>
            </div>
            <div className='SponsoredCard-footer'>
	            <div className='SponsoredCard-type'>{ tier.title }</div>
	            <div className='SponsoredCard-amount'>{`${formattedAmount} ${interval}`}</div>
            </div>
          </div>
        </a>
      </div>
    );
  }

}

SponsoredCard.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  interval: PropTypes.string.isRequired,
  logo: PropTypes.string,
  name: PropTypes.string.isRequired,
  publicUrl: PropTypes.string,
  tier: PropTypes.string.isRequired,
};

SponsoredCard.defaultProps = {
  amount: 0,
  currency: 'USD',
  interval: '',
  tier: '',
}
