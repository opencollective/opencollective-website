import React, { PropTypes } from 'react';
import Mosaic from '../Mosaic';

export default class ContributorList extends React.Component {

 render() {
  const { group, i18n } = this.props;

  if (group.contributors.length === 0) return (<div />);

  return (
    <div className='PublicGroup-os-contrib-container'>
      <div className='line1' >+{ group.contributors.length } {i18n.getString('contributorsOnGithub')}</div>
      <Mosaic hovercards={group.contributors} svg={`/${group.slug}/contributors.svg?button=false&style=square&width=640&margin=0`} i18n={i18n} />
    </div>
    );
  }
}

ContributorList.PropTypes = {
  i18n: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired
};