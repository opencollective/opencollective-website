import React from 'react';

export default class OnBoardingHeader extends React.Component {

  constructor(props)
  {
    super(props);
  }
  
  render()
  {
    return (
      <div className='OnBoardingHeader'>
        <div className='-brand'>
          <svg width='18px' height='18px' className='-light-blue align-middle mr1'>
            <use xlinkHref='#svg-isotype'/>
          </svg>
          <svg width='172px' height='30px' className='align-middle xs-hide'>
            <use xlinkHref='#svg-logotype' fill='#6388bf'/>
          </svg>
        </div>
        <div className='-nav'>
          <a href="#">start a colletive!</a>
          <a href="#">login</a>
        </div>
      </div>
    )
  }
}
