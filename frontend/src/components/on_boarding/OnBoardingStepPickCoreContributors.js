import React from 'react';

import OnBoardingStepHeading from './OnBoardingStepHeading';
import ContributorPicker from './ContributorPicker';

export default class OnBoardingStepPickCoreContributors extends React.Component {

  constructor(props)
  {
    super(props);
    this.chosenContributors = [];
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
    const availableContributors = this.availableContributors;
    const chosenContributors = this.chosenContributors;
    return (
      <div className="OnBoardingStepPickCoreContributors">
        <OnBoardingStepHeading step="3/4" title="Select your core contributors." subtitle="Add at least 2 members from the repository contributors, they will have acces to the funds. All other repository contributors will be listed as regular contributors in your collective page."/>
        <ContributorPicker
          available={availableContributors}
          chosen={chosenContributors}
          onChoose={(contributor) => {
            const availableIndex = availableContributors.indexOf(contributor);
            availableContributors.splice(availableIndex, 1);
            chosenContributors.push(contributor);
            this.forceUpdate();
          }}
          onRemove={(contributor) => {
            const chosenIndex = chosenContributors.indexOf(contributor);
            chosenContributors.splice(chosenIndex, 1);
            availableContributors.push(contributor);
            this.forceUpdate();
          }}
        />
        <div style={{margin: '0 auto', marginTop: '40px', width: '300px', textAlign: 'center'}}>
          <div className={`OnBoardingButton ${chosenContributors.length > 1 ? '' : 'disabled'}`} onClick={chosenContributors.length > 1 && onNextStep}>continue</div>
        </div>
      </div>
    )
  }
}
