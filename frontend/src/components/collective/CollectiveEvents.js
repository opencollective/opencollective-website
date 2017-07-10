import React, { Component, PropTypes } from 'react';

export default class CollectiveEvents extends Component {

  componentDidMount() {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = `/${this.props.collective.slug}/events.js`;
    s.async = true;
    this.instance.appendChild(s);
  }

  render() {
    const { i18n } = this.props;

    return (
      <section id='events'>
        <div className='CollectiveEvents-container'>
          <h1>{ `${i18n.getString('menuEvents')} ` }</h1>
          <div ref={(el) => (this.instance = el)} />
        </div>
      </section>
    );
  }
}

CollectiveEvents.propTypes = {
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
}