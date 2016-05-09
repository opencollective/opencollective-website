import React from 'react';

import OnBoardingStepHeading from './OnBoardingStepHeading';

export default class OnBoardingStepConnectGithub extends React.Component {

  constructor(props)
  {
    super(props);
  }
  
  render()
  {
    const { onNextStep } = this.props;
    return (
      <div className="OnBoardingStepConnectGithub">
          <OnBoardingStepHeading step="1/4" title="Connect your Github account."/>
          <div style={{margin: '0 auto', marginTop: '40px', width: '300px', textAlign: 'center'}}>
            <a href="#" className="OnBoardingStepButton mb3 -btn -btn-big -bg-green -ttu -ff-sec -fw-bold color-white m-auto" onClick={onNextStep}>connect account</a>
          </div>
      </div>
    )
  }
}
