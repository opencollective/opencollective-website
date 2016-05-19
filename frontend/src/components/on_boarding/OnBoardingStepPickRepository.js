import React from 'react';

import { MIN_STARS_FOR_ONBOARDING } from '../../constants/github';

import OnBoardingStepHeading from './OnBoardingStepHeading';
import RepositoryPicker from './RepositoryPicker';

export default class OnBoardingStepPickRepository extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const buttonContainerStyle = {margin: '0 auto', marginTop: '30px', width: '300px', textAlign: 'center'};
    const { onNextStep, githubForm } = this.props;
    const repository = githubForm.attributes.repository;
    const repositories = this.props.repositories.filter((repo) => {return repo.stars >= MIN_STARS_FOR_ONBOARDING})
    repositories.sort((A, B) => B.stars - A.stars);

    return (
      <div className="OnBoardingStepPickRepository">
        <OnBoardingStepHeading step="2/4" title="Pick a repository" subtitle="Select a project you wish to create an open collective for."/>
        <RepositoryPicker repositories={repositories} onSelect={this.select.bind(this)} selectedRepo={repository} />
        <div style={buttonContainerStyle}>
          <div className={`OnBoardingButton ${repository ? '': 'disabled'}`} onClick={repository ? () => onNextStep(repository) : null}>continue</div>
        </div>
      </div>
    )
  }

  select(repository) {
    const { appendGithubForm } = this.props;
    appendGithubForm({repository: repository});
    this.forceUpdate();
  }
}
