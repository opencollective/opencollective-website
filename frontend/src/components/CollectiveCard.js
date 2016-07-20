import React, {Component, PropTypes} from 'react';

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
    const {key, bg, logo, name, description, url, stats, className} = this.props;
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
              <div className='CollectiveCard-description'>{description}</div>
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
  stats: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  logo: PropTypes.string,
  url: PropTypes.string
};