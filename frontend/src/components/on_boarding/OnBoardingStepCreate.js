import React from 'react';

import OnBoardingStepHeading from './OnBoardingStepHeading';

export default class OnBoardingStepCreate extends React.Component {

  constructor(props)
  {
    super(props);
  }
  
  render()
  {
    const { onCreate } = this.props;
    return (
      <div className="OnBoardingStepCreate">
        <OnBoardingStepHeading step="4/4" title="Why do you want to create a collective?" subtitle="The answers will be public and help you motivate people to back your project."/>
        <div style={{margin: '0 auto', marginTop: '40px', width: '300px', textAlign: 'center'}}>
          <a href="#" className="OnBoardingStepButton mb3 -btn -btn-big -bg-green -ttu -ff-sec -fw-bold color-white m-auto" onClick={onCreate}>create!</a>
        </div>
      </div>
    )
  }
}
