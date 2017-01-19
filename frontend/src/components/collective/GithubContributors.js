import React, { PropTypes } from 'react';

export default class GithubContributors extends React.Component {

 render() {
  const { collective, i18n } = this.props;

  if (collective.contributors.length === 0) return (<div />);

  let avatarHeight = 64, margin = 5;
  if (collective.contributors.length > 50) {
    avatarHeight = 48;
    margin = 3;
  }
  if (collective.contributors.length > 150) {
    avatarHeight = 24;
    margin = 2;
  }

  const githubUrl = collective.settings.githubOrg ? `https://github.com/${collective.settings.githubOrg}` : `https://github.com/${collective.settings.githubRepo}/graphs/contributors`;

  return (
    <div className='GithubContributors'>
      <div className='line1' >+{ collective.contributors.length } {i18n.getString('contributorsOnGithub')}</div>
      <a href={githubUrl} target="_blank"><img width="640" src={`/${collective.slug}/contributors.png?avatarHeight=${avatarHeight}&button=false&width=640&margin=${margin}`} /></a>
    </div>
    );
  }
}

GithubContributors.PropTypes = {
  i18n: PropTypes.object.isRequired,
  collective: PropTypes.object.isRequired
};