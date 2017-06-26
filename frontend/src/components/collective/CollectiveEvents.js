import React, { Component, PropTypes } from 'react';

export default class CollectiveEvents extends Component {
  render() {
    const { collective, i18n } = this.props;

    return (
      <section id='events'>
        <div className='CollectiveEvents-container'>
          <h1>{ `${i18n.getString('menuEvents')} ` }</h1>
          <iframe width="100%" src={`https://opencollective.com/${collective.slug}/events/iframe`} frameBorder="0" />
        </div>
      </section>
    );
  }
}

CollectiveEvents.propTypes = {
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
}