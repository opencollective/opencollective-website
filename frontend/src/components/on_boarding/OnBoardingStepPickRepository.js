import React from 'react';

import OnBoardingStepHeading from './OnBoardingStepHeading';
import RepositoryPicker from './RepositoryPicker';
import * as constants from '../../constants/github.js';

export default ({ onNextStep, githubForm, repositories, blacklist, appendGithubForm, fetchedRepositories}) => {

  const buttonContainerStyle = {margin: '0 auto', marginTop: '30px', width: '300px', textAlign: 'center'};
  const { repository } = githubForm.attributes;
  repositories = repositories.sort((A, B) => B.stars - A.stars);
  const singleRepo = repositories.length === 1;
  const validRepos = repositories.filter(repo => blacklist.indexOf(repo.title) === -1);
  const noRepo = validRepos.length === 0;

  return (
    <div className="OnBoardingStepPickRepository">
      <OnBoardingStepHeading step="1/3" title="Pick a repository" subtitle={`\"Select a project you wish to create an open collective for.\nOnly repositories with at least ${constants.MIN_STARS_FOR_ONBOARDING} stars and ${constants.MIN_CONTRIBUTORS_FOR_ONBOARDING} contributors are eligible.\"`}/>
      {fetchedRepositories && !noRepo && (
          <div>
            <RepositoryPicker repositories={validRepos} onSelect={(repository, owner) => appendGithubForm({ repository, username: owner })} selectedRepo={repository} />
            <div style={buttonContainerStyle}>
              <div className={`OnBoardingButton ${repository || singleRepo ? '': 'disabled'}`} onClick={repository || singleRepo ? () => onNextStep(singleRepo ? repositories[0].title : repository) : null}>continue</div>
            </div>
          </div>
        )
      }
      {fetchedRepositories && noRepo && (
          <div>
            <img className="mx-auto my4 block" src="/public/images/github-star.svg"/>
            <div className="center" style={{fontFamily: 'Lato', fontSize: '22px', color: '#4a4a4a', padding: '0 20px'}}>
            We didn’t find any repository with {constants.MIN_STARS_FOR_ONBOARDING}+
            <svg width='19px' height='19px' className='mt1' style={{color: '#4a4a4a', margin: '5px 4px 0px 4px'}}>
              <use xlinkHref='#svg-star'/>
            </svg>
            </div>
            <div className="center mt1 mx-auto" style={{fontFamily: 'Lato', fontSize: '17px', color: '#bbc1c4', width: '100%', maxWidth: '480px', padding: '0 20px'}}>
              You will be notified when the requirements change. In the meantime you can visit other <a href="/opensource">Open Source collectives</a>
            </div>
          </div>
        )
      }
    </div>
  )
}
