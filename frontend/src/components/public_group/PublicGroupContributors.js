import React, { PropTypes } from 'react';
import Mosaic from '../Mosaic';

export default class ContributorList extends React.Component {

 render() {
  const { contributors, i18n } = this.props;

  if (contributors.length === 0) return (<div />);

  return (
    <div className='PublicGroup-os-contrib-container'>
      <div className='line1' >+{ contributors.length } {i18n.getString('contributorsOnGithub')}</div>
      <Mosaic users={contributors} i18n={i18n} />
    </div>
    );
  }
}

ContributorList.PropTypes = {
  i18n: PropTypes.object.isRequired,
  contributors: PropTypes.object.isRequired
};