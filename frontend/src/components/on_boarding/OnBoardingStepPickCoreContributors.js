import React from 'react';

import { MIN_CONTRIBUTORS_FOR_ONBOARDING } from '../../constants/github';

import OnBoardingStepHeading from './OnBoardingStepHeading';
import ContributorPicker from './ContributorPicker';

export default class OnBoardingStepPickCoreContributors extends React.Component {

  constructor(props) {
    super(props);
    this.chosenContributors = [];
  }

  render() {
    const buttonContainerStyle = {margin: '0 auto', marginTop: '40px', width: '300px', textAlign: 'center'};
    const { onNextStep, contributors: availableContributors, appendGithubForm, githubForm } = this.props;
    const chosenContributors = this.chosenContributors;
    const contributors = githubForm.attributes.contributors || [];

    return (
      <div className="OnBoardingStepPickCoreContributors">
        <OnBoardingStepHeading step="3/4" title="Select your core contributors" subtitle="Add at least 2 members who have contributd to this repository. They will have access to the funds. All other repository contributors will be listed as regular contributors in your collective page."/>
        <ContributorPicker
          available={availableContributors}
          chosen={chosenContributors}
          onChoose={(contributor) => {
            const availableIndex = availableContributors.indexOf(contributor);
            availableContributors.splice(availableIndex, 1);
            chosenContributors.push(contributor);
            appendGithubForm({contributors: chosenContributors.map((c) => c.name)});
            this.forceUpdate();
          }}
          onRemove={(contributor) => {
            const chosenIndex = chosenContributors.indexOf(contributor);
            chosenContributors.splice(chosenIndex, 1);
            availableContributors.push(contributor);
            appendGithubForm({contributors: chosenContributors.map((c) => c.name)});
            this.forceUpdate();
          }}
        />
        <div style={buttonContainerStyle}>
          <div className={`OnBoardingButton ${contributors.length >= MIN_CONTRIBUTORS_FOR_ONBOARDING-1 ? '' : 'disabled'}`} onClick={contributors.length >= MIN_CONTRIBUTORS_FOR_ONBOARDING-1 ? () => onNextStep(contributors) : null }>continue</div>
        </div>
      </div>
    )
  }
}
