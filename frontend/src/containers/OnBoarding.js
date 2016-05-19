import React, { Component } from 'react';
import { connect } from 'react-redux';

import Notification from '../containers/Notification';

import OnBoardingHeader from '../components/on_boarding/OnBoardingHeader';
import OnBoardingHero from '../components/on_boarding/OnBoardingHero';
import OnBoardingStepConnectGithub from '../components/on_boarding/OnBoardingStepConnectGithub';
import OnBoardingStepPickRepository from '../components/on_boarding/OnBoardingStepPickRepository';
import OnBoardingStepPickCoreContributors from '../components/on_boarding/OnBoardingStepPickCoreContributors';
import OnBoardingStepCreate from '../components/on_boarding/OnBoardingStepCreate';
import OnBoardingStepThankYou from '../components/on_boarding/OnBoardingStepThankYou';

import fetchReposFromGitHub from '../actions/github/fetch_repos';
import fetchContributorsFromGitHub from '../actions/github/fetch_contributors';
import uploadImage from '../actions/images/upload';
import appendGithubForm from '../actions/form/append_github';
import createGroupFromGithubRepo from '../actions/groups/create_group_from_github_repo';
import notify from '../actions/notification/notify';

import { MIN_STARS_FOR_ONBOARDING } from '../constants/github';

export class OnBoarding extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      selectedRepo: '',
      chosenContributors: []
    };
  }

  componentWillMount() {
    const { githubUsername } = this.props;
    if (githubUsername && this.state.step === 0) {
      this.setState({step: 2});
    }
  }

  componentDidMount() {
    const {
      githubUsername,
      fetchReposFromGitHub,
      appendGithubForm
    } = this.props;

    if (githubUsername && this.state.step === 2) {
      appendGithubForm({username: githubUsername});
      fetchReposFromGitHub(githubUsername);
    }
  }

  render() {
    const { step } = this.state;
    const { contributors, githubForm } = this.props;
    let { repositories } = this.props;

    repositories = repositories.filter((repo) => repo.stars >= MIN_STARS_FOR_ONBOARDING);
    repositories.sort((A, B) => B.stars - A.stars);

    return (
      <div className={`OnBoarding ${step ? '-registering' : ''}`}>
        <Notification />
        {step !== 5 && <OnBoardingHeader active={Boolean(step)} username={githubForm.attributes.username} />}
        {step === 0 && <OnBoardingHero onClickStart={() => this.setState({step: 1})} />}
        {step === 1 && <OnBoardingStepConnectGithub />}
        {step === 2 && <OnBoardingStepPickRepository repositories={repositories} onNextStep={(selectedRepo) => this.getContributors.bind(this, selectedRepo)} />}
        {step === 3 && <OnBoardingStepPickCoreContributors contributors={contributors} onNextStep={(chosenContributors) => this.setState({step: 4, chosenContributors})} />}
        {step === 4 && <OnBoardingStepCreate onCreate={this.create.bind(this)} {...this.props} />}
        {step === 5 && <OnBoardingStepThankYou onContinue={() => window.location = '/opensource' }/>}
      </div>
    )
  }

  create(missionDescription, expenseDescription, logo) {
    const {
      githubUsername,
      params,
      createGroupFromGithubRepo } = this.props;
    const { selectedRepo, chosenContributors } = this.state;

    const payload = {
      group: {
        name: selectedRepo,
        slug: selectedRepo,
        mission: missionDescription,
        expensePolicy: expenseDescription,
        logo
      },
      users: chosenContributors,
      github_username: githubUsername,
    }
    this.setState({step: 5});
    return createGroupFromGithubRepo(payload, params.token)
      .catch(err => notify('error', err.message));
  }

  getContributors(selectedRepo) {
    const {
      githubUsername,
      fetchContributorsFromGitHub } = this.props;

    this.setState({step: 3, selectedRepo})
    fetchContributorsFromGitHub(githubUsername, selectedRepo)
    .catch(err => notify('error', err.message));
  }
}

export default connect(mapStateToProps, {
  fetchReposFromGitHub,
  fetchContributorsFromGitHub,
  uploadImage,
  appendGithubForm,
  createGroupFromGithubRepo
})(OnBoarding);

function mapStateToProps({github, form}) {

  var githubUsername = '';
  if (github.connectedAccount) {
    githubUsername = github.connectedAccount.username;
  }

  return {
    githubUsername,
    repositories: github.repositories || [],
    contributors: github.contributors || [],
    githubForm: form.github
  };
}
