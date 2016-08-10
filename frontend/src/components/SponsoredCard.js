import React, {Component, PropTypes} from 'react';

import formatCurrency from '../lib/format_currency';

const DEFAULT_BG = '/static/images/collectives/default-header-bg.jpg';
const DEFAULT_LOGOS = [
  '/static/images/code.svg',
  '/static/images/rocket.svg',
  '/static/images/repo.svg',
];

export default class SponsoredCard extends Component {

  constructor(props) {
    super(props);
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
      className,
      i18n
    } = this.props;

    return (
      <div className={`SponsoredCard ${className}`}>
        <a href={publicUrl}>
          <div>
            <div className='SponsoredCard-head'></div>
            <div className='SponsoredCard-body'></div>
            <div className='SponsoredCard-footer'></div>
          </div>
        </a>
      </div>
    );
  }

}

SponsoredCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  logo: PropTypes.string,
  url: PropTypes.string
};
