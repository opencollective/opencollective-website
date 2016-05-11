import React from 'react';

import OnBoardingStepHeading from './OnBoardingStepHeading';
import ContributorPicker from './ContributorPicker';

export default class OnBoardingStepPickCoreContributors extends React.Component {

  constructor(props)
  {
    super(props);
  }
  
  render()
  {
    const { onNextStep } = this.props;
    return (
      <div className="OnBoardingStepPickCoreContributors">
        <OnBoardingStepHeading step="3/4" title="Select your core contributors." subtitle="Add at least 2 members from the repository contributors, they will have acces to the funds. All other repository contributors will be listed as regular contributors in your collective page."/>
        <ContributorPicker />
        <div style={{margin: '0 auto', marginTop: '40px', width: '300px', textAlign: 'center'}}>
          <a href="#" className="OnBoardingStepButton mb3 -btn -btn-big -bg-green -ttu -ff-sec -fw-bold color-white m-auto" onClick={onNextStep}>continue</a>
        </div>
      </div>
    )
  }
}
