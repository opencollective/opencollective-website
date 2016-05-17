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


export class OnBoarding extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      selectedRepo: ''
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
      fetchReposFromGitHub
    } = this.props;

    if (githubUsername && this.state.step === 2) {
      fetchReposFromGitHub(githubUsername);
    }
  }

  render(){
    const { step } = this.state;
    const { repositories, contributors } = this.props;
    return (
      <div className={`OnBoarding ${step ? '-registering' : ''}`}>
        <Notification />
        {step !== 5 && <OnBoardingHeader active={Boolean(step)} />}
        {step === 0 && <OnBoardingHero onClickStart={() => this.setState({step: 1})} />}
        {step === 1 && <OnBoardingStepConnectGithub onNextStep={() => this.setState({step: 2})} />}
        {step === 2 && <OnBoardingStepPickRepository repositories={repositories} onNextStep={(selectedRepo) => this.getContributors.bind(this, selectedRepo)} />}
        {step === 3 && <OnBoardingStepPickCoreContributors contributors={contributors} onNextStep={() => this.setState({step: 4})} />}
        {step === 4 && <OnBoardingStepCreate onCreate={() => this.setState({step: 5})}/>}
        {step === 5 && <OnBoardingStepThankYou onContinue={() => this.setState({step: 0})}/>}
      </div>
    )
  }

  getContributors(selectedRepo) {
    const {
      githubUsername,
      fetchContributorsFromGitHub } = this.props;

    this.setState({step: 3, selectedRepo})
    fetchContributorsFromGitHub(githubUsername, selectedRepo);
  }
}

export default connect(mapStateToProps, {
  fetchReposFromGitHub,
  fetchContributorsFromGitHub
})(OnBoarding);

function mapStateToProps({github}) {

  var githubUsername = '';
  if (github.connectedAccount) {
    githubUsername = github.connectedAccount.username;
  }

  return {
    githubUsername,
    repositories: github.repositories || [],
    contributors: github.contributors || []
  };
}
