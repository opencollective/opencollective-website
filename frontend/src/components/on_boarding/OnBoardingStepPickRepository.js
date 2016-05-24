import React from 'react';

import OnBoardingStepHeading from './OnBoardingStepHeading';
import RepositoryPicker from './RepositoryPicker';

export default ({ onNextStep, githubForm, repositories, appendGithubForm }) => {

  const buttonContainerStyle = {margin: '0 auto', marginTop: '30px', width: '300px', textAlign: 'center'};
  const repository = githubForm.attributes.repository;
  repositories = repositories.sort((A, B) => B.stars - A.stars)
  const singleRepo = repositories.length === 1;

  return (
    <div className="OnBoardingStepPickRepository">
      <OnBoardingStepHeading step="1/3" title="Pick a repository" subtitle="Select a project you wish to create an open collective for.\nOnly repositories with at least 100 stars and 2 contributors are eligible."/>
      <RepositoryPicker repositories={repositories} onSelect={(repository) => appendGithubForm({ repository })} selectedRepo={repository} />
      <div style={buttonContainerStyle}>
        <div className={`OnBoardingButton ${repository || singleRepo ? '': 'disabled'}`} onClick={repository || singleRepo ? () => onNextStep(singleRepo ? repositories[0].title : repository) : null}>continue</div>
      </div>
    </div>
  )
}
