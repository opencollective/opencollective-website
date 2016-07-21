import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Notification from '../containers/Notification';

import i18n from '../lib/i18n';

import OnBoardingHeader from '../components/on_boarding/OnBoardingHeader';
import OnBoardingHero from '../components/on_boarding/OnBoardingHero';
import OnBoardingStepPickRepository from '../components/on_boarding/OnBoardingStepPickRepository';
import OnBoardingStepPickCoreContributors from '../components/on_boarding/OnBoardingStepPickCoreContributors';
import OnBoardingStepCreate from '../components/on_boarding/OnBoardingStepCreate';
import OnBoardingStepThankYou from '../components/on_boarding/OnBoardingStepThankYou';

import fetchReposFromGitHub from '../actions/github/fetch_repos';
import fetchContributorsFromGitHub from '../actions/github/fetch_contributors';
import fetchUserFromGithub from '../actions/github/fetch_user';
import uploadImage from '../actions/images/upload';
import notify from '../actions/notification/notify';
import appendGithubForm from '../actions/form/append_github';
import createGroupFromGithubRepo from '../actions/groups/create_from_github_repo';
import validateSchema from '../actions/form/validate_schema';

import githubSchema from '../joi_schemas/github';

export class OnBoarding extends Component {

  static propTypes = {
    githubUsername: PropTypes.string,
    repositories: PropTypes.arrayOf(PropTypes.object),
    contributors: PropTypes.arrayOf(PropTypes.object),
    githubForm: PropTypes.object,
  }

  static defaultProps = {
    githubUsername: '',
    repositories: [],
    contributors: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      step: 0
    };
    this.blacklist = [];
  }

  componentWillMount() {
    const { githubUsername } = this.props;
    if (githubUsername && this.state.step === 0) {
      this.setState({step: 1});
    }
  }

  componentDidMount() {
    const {
      githubUsername,
      fetchReposFromGitHub,
      fetchUserFromGithub,
      appendGithubForm,
      params,
      notify
    } = this.props;

    if (githubUsername && this.state.step === 1) {
      appendGithubForm({username: githubUsername, token: params.token});
      fetchReposFromGitHub(githubUsername, params.token)
      .catch((error) => {
        notify('error', error.message);
      });
      fetchUserFromGithub(githubUsername)
      .catch((error) => {
        console.error(error.message);
      });
    }
  }

  render() {
    const { step } = this.state;
    const { contributors, githubForm, repositories, utmSource } = this.props;
    return (
      <div className={`OnBoarding ${step ? '-registering' : ''}`}>
        <Notification autoclose={true} />
        {step !== 4 && <OnBoardingHeader active={Boolean(step)} username={githubForm.attributes.username} />}
        {step === 0 && <OnBoardingHero utmSource={utmSource} />}
        {step === 1 && <OnBoardingStepPickRepository repositories={repositories} blacklist={this.blacklist} onNextStep={(repository) => {
          if (!githubForm.attributes.repository) githubForm.attributes.repository = repository;
          this.getContributors(githubForm.attributes.repository, githubForm.attributes.username);
        }} {...this.props} />}
        {step === 2 && <OnBoardingStepPickCoreContributors contributors={contributors} onNextStep={() => this.setState({step: 3})} {...this.props} />}
        {step === 3 && <OnBoardingStepCreate onCreate={this.create.bind(this)} {...this.props} />}
        {step === 4 && <OnBoardingStepThankYou onContinue={() => window.location = '/opensource' }/>}
      </div>
    )
  }

  create() {
    const { githubForm, validateSchema, createGroupFromGithubRepo, githubUser,utmSource } = this.props;
    const attr = githubForm.attributes;
    const payload = {
      group: {
        name: attr.repository,
        slug: attr.repository,
        mission: attr.mission,
        longDescription: attr.description,
        logo: attr.logo || '',
        website: `https://github.com/${attr.username}/${attr.repository}`,
        data: {
          utmSource
        },
        settings: {
          githubRepo: `${attr.username}/${attr.repository}`
        },
        tags: ['open source'],
        tiers: [{
            "name":"backer",
            "title":"Backers",
            "description":"Support us with a monthly donation and help us continue our activities.",
            "button":"Become a backer",
            "range":[2,100000],"presets":[2,5,10,25,50],
            "interval":"monthly"
          },
          {
            "name":"sponsor",
            "title":"Sponsors",
            "description":"Become a sponsor and get your logo on our README on Github with a link to your site.",
            "button":"Become a sponsor",
            "range":[100,500000],
            "presets":[100,250,500],
            "interval":"monthly"
          }]
      },
      users: attr.contributors,
      github_username: attr.username,
      user: githubUser || {},

    };

    return validateSchema(githubForm.attributes, githubSchema)
      .then(() => createGroupFromGithubRepo(payload, attr.token))
      .then(() => this.setState({step: 4}))
      .catch(({message}) => notify('error', message));
  }

  getContributors(selectedRepo, owner) {
    const {
      githubUsername,
      fetchContributorsFromGitHub,
      notify } = this.props;

    fetchContributorsFromGitHub(owner, selectedRepo)
    .then(() => {
      if (githubUsername !== owner) {
        const contributors = this.props.contributors;
        contributors.sort((A, B) => B.contributions - A.contributions);
        const topTree = contributors.slice(0, 3).map(contributor => contributor.name);

        if (topTree.indexOf(githubUsername) === -1) {
          this.blacklist.push(selectedRepo);
          this.setState({step: 1});
          notify('error', `You need to be a top contributor for ${selectedRepo} in order to create a collective`);
          this.props.contributors.length = 0;
          return
        }
      }
      this.setState({step: 2, selectedRepo})
    })
    .catch((error) => {
      this.setState({step: 1});
      notify('error', error.message);
    });
  }
}

export default connect(mapStateToProps, {
  fetchReposFromGitHub,
  fetchContributorsFromGitHub,
  fetchUserFromGithub,
  uploadImage,
  appendGithubForm,
  notify,
  createGroupFromGithubRepo,
  validateSchema
})(OnBoarding);

function mapStateToProps({router, github, form}) {

  let githubUsername = '';
  if (github.connectedAccount) {
    githubUsername = github.connectedAccount.username;
  }
  const query = router.location.query;
  const utmSource = query.utm_source;

  return {
    githubUsername,
    githubUser: github.user,
    fetchedRepositories: Boolean(github.repositories),
    repositories: github.repositories || [],
    contributors: github.contributors || [],
    githubForm: form.github,
    i18n: i18n('en'),
    utmSource
  };
}
