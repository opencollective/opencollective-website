import React from 'react';

export default class OnBoardingHeader extends React.Component {

  constructor(props)
  {
    super(props);
  }
  
  render()
  {
    const { active, avatar, name } = this.props;
    const headerStyles = active ? {background: '#3d3d3d', padding: '20px 30px', marginBottom: '50px'} : {};

    return (
      <div className='OnBoardingHeader' style={headerStyles}>
        <a className='-brand' href="/">
          <svg width='18px' height='18px' className='-light-blue align-middle mr1'>
            <use xlinkHref='#svg-isotype'/>
          </svg>
          <svg width='172px' height='30px' className='align-middle xs-hide'>
            <use xlinkHref='#svg-logotype' fill={active ? '#fff': '#6388bf'}/>
          </svg>
        </a>
        {!active && 
          <div className='-nav'>
            <a href="https://opencollective.com/#apply">start a colletive</a>
            <a href="https://app.opencollective.com/github/apply?next=/opencollective">login</a>
          </div>
        }
        {active &&
          <div className='-nav'>
            {avatar && <img src={avatar} height="24px" width="24px" />}
            <span>{name}</span>
          </div>
        }
      </div>
    )
  }
}
