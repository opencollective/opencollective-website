import React from 'react';

import OnBoardingStepHeading from './OnBoardingStepHeading';

export default class OnBoardingStepPickRepository extends React.Component {

  constructor(props)
  {
    super(props);
  }
  
  render()
  {
    const { onNextStep } = this.props;
    return (
      <div className="OnBoardingStepPickRepository">
        <OnBoardingStepHeading step="2/4" title="Pick a repository." subtitle="Select the project you wish to create an Open Collective for."/>
        <div style={{margin: '0 auto', marginTop: '40px', width: '300px', textAlign: 'center'}}>
          <a href="#" className="OnBoardingStepButton mb3 -btn -btn-big -bg-green -ttu -ff-sec -fw-bold color-white m-auto" onClick={onNextStep}>continue</a>
        </div>
      </div>
    )
  }
}
