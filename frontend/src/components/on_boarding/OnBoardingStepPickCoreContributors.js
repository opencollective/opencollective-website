import React from 'react';

import OnBoardingStepHeading from './OnBoardingStepHeading';
import ContributorPicker from './ContributorPicker';

export default class OnBoardingStepPickCoreContributors extends React.Component {

  constructor(props)
  {
    super(props);
    this.chosenContributors = [
      {name: 'Alvin Castro'}
    ];
    this.availableContributors = [
      {name: 'Don Gill'},
      {name: 'Landon Roberts'},
      {name: 'Jayden Collier'},
      {name: 'Curtis Fisher'},
      {name: 'Lesse Palmer'},
    ];
  }
  
  render()
  {
    const { onNextStep } = this.props;
    return (
      <div className="OnBoardingStepPickCoreContributors">
        <OnBoardingStepHeading step="3/4" title="Select your core contributors." subtitle="Add at least 2 members from the repository contributors, they will have acces to the funds. All other repository contributors will be listed as regular contributors in your collective page."/>
        <ContributorPicker available={this.availableContributors} chosen={this.chosenContributors} />
        <div style={{margin: '0 auto', marginTop: '40px', width: '300px', textAlign: 'center'}}>
          <div className='OnBoardingButton' onClick={onNextStep}>continue</div>
        </div>
      </div>
    )
  }
}
