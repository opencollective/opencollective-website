import React, { PropTypes } from 'react';
import debounce from 'lodash/debounce';

export default class GithubContributors extends React.Component {

  constructor(props) {
    super(props);
    this.state = { width: 0 };
  }

  componentDidMount() {
    this.el = React.findDOMNode(this)
    this.resizeMosaic();
    window.addEventListener("resize", this.debouncedResizeMosaic.bind(this));
  }

  resizeMosaic() {
    const styles = window.getComputedStyle(this.el.parentNode, null);
    let width = this.el.parentNode.getBoundingClientRect().width - parseInt(styles.paddingLeft, 10) - parseInt(styles.paddingRight, 10);
    width = Math.min(Math.floor(width / 60) * 60, 1000); // round down to the closest multiple of 60 to avoid requesting too many different filesizes
    this.setState({width});
  }

  debouncedResizeMosaic() {
    debounce(() => {
      this.resizeMosaic();
    }, 500)();
  }

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
      <a href={githubUrl} target="_blank"><img width={this.state.width} src={`/${collective.slug}/contributors.png?avatarHeight=${avatarHeight}&button=false&width=${this.state.width}&margin=${margin}`} /></a>
    </div>
    );
  }
}

GithubContributors.PropTypes = {
  i18n: PropTypes.object.isRequired,
  collective: PropTypes.object.isRequired
};