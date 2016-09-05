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
    const { onNextStep, contributors: availableContributors, appendGithubForm } = this.props;
    const { chosenContributors } = this;
    const canContinue = chosenContributors.length >= MIN_CONTRIBUTORS_FOR_ONBOARDING;

    return (
      <div className="OnBoardingStepPickCoreContributors">
        <OnBoardingStepHeading step="2/3" title="Select your core contributors" subtitle=""/>
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
          <div className={`OnBoardingButton ${canContinue ? '' : 'disabled'}`} onClick={canContinue ? () => onNextStep(chosenContributors) : null }>continue</div>
          {!canContinue ? <span style={{marginTop: '10px', display: 'block', fontSize: '12px'}}>You need to select at least two contributors</span> : null}
        </div>
      </div>
    )
  }
}
