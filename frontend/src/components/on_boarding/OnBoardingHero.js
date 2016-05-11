import React from 'react';

export default class OnBoardingHero extends React.Component {

  constructor(props)
  {
    super(props);
  }

  render()
  {
    const { onClickStart } = this.props;
    return (
      <div className='OnBoardingHero'>
        <div className='-title'>
          Apply to create an open collective for your <strong>open source</strong> project.
        </div>
        <div className='-subtitle'>
          We are slowly accepting new open collectives. Reserve your spot today.
        </div>
        <div className='-button-container'>
          <a href="#" className="OnBoardingStepButton mb3 -btn -btn-big -bg-green -ttu -ff-sec -fw-bold" onClick={onClickStart} >Let's do this</a>
        </div>
        <div className="-requirements">
          You will require a github account, a repository with over 100 stars & at least 2 contributors.
        </div>
      </div>
    )
  }
}
