import React, { Component, PropTypes } from 'react';

export default class OnBoardingHeader extends Component {

  static propTypes = {
    active: PropTypes.bool,
    hideLogoText: PropTypes.bool,
    links: PropTypes.arrayOf(PropTypes.object),
    logoSize: PropTypes.number,
    username: PropTypes.string
  }

  static defaultProps = {
    active: false,
    hideLogoText: false,
    links: [],
    logoSize: 18,
    username: ''
  }

  constructor(props) {
    super(props);
  }
  
  render() {
    const { active, username, logoSize, links, hideLogoText } = this.props;
    const headerStyles = active ? {background: '#3d3d3d', padding: '20px 30px'} : {};
    return (
      <div className='OnBoardingHeader' style={headerStyles}>
        <a className='-brand' href="/">
          <svg width={`${logoSize}px`} height={`${logoSize}px`} className='-light-blue align-middle mr1'>
            <use xlinkHref='#svg-isotype'/>
          </svg>
          {!hideLogoText && (
              <svg width='172px' height='30px' className='align-middle'>
                <use xlinkHref='#svg-logotype' fill={active ? '#fff': '#6388bf'}/>
              </svg>
            )
          }
        </a>
        {!active && 
          <div className='-nav'>
            <a href="https://opencollective.com/#apply">start a collective</a>
            {links.length && links.map(link => <a href={link.href}>{link.text}</a>)}
          </div>
        }
        {active &&
          <div className='-nav'>
            {username && <img src={`//avatars.githubusercontent.com/${username}?s=24`} height="24px" width="24px" />}
            <span>{username}</span>
          </div>
        }
      </div>
    )
  }
}
