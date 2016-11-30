import React, { PropTypes } from 'react';
import Mosaic from '../Mosaic';

export default class ContributorList extends React.Component {

 render() {
  const { collective, i18n } = this.props;

  if (collective.contributors.length === 0) return (<div />);

  return (
    <div className='Collective-os-contrib-container'>
      <div className='line1' >+{ collective.contributors.length } {i18n.getString('contributorsOnGithub')}</div>
      <Mosaic hovercards={collective.contributors} svg={`/${collective.slug}/contributors.svg?button=false&width=640&margin=5`} i18n={i18n} />
    </div>
    );
  }
}

ContributorList.PropTypes = {
  i18n: PropTypes.object.isRequired,
  collective: PropTypes.object.isRequired
};