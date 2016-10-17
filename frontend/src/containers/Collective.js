import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StickyContainer } from 'react-sticky';

// Our libraries
import { canEditGroup } from '../lib/admin';
import i18nLib from '../lib/i18n';

// Containers
import Notification from './Notification';

// Components
import CollectiveHero from '../components/collective/CollectiveHero';
import PublicFooter from '../components/PublicFooter';

// Actions
import appendEditCollectiveForm from '../actions/form/append_edit_collective';

const DEFAULT_COLLECTIVE_SETTINGS = {
  lang: 'en',
  formatCurrency: {
    compact: false,
    precision: 2
  }
};

export class Collective extends Component {
  render() {
    const {
      collective
    } = this.props;

    return (
      <div className='Collective'>
        <Notification />
        <StickyContainer>
          <CollectiveHero collective={ collective } {...this.props} />

          <PublicFooter />
        </StickyContainer>
      </div>
    );
  }
}

export default connect(mapStateToProps, {

})(Collective);

function mapStateToProps({
  collectives,
  form,
  router,
  session,
}) {

  const slug = router.params.slug.toLowerCase();
  const collective = collectives[slug] || {};
  collective.settings = collective.settings || DEFAULT_COLLECTIVE_SETTINGS;

  return {
    canEditCollective: canEditGroup(session, collective),
    collective,
    collectiveForm: form.editCollective,
    i18n: i18nLib(collective.settings.lang || 'en'),
  };
}
