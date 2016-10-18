import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StickyContainer } from 'react-sticky';
import { createStructuredSelector } from 'reselect';

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

// Selectors
import {
  getSlugSelector,
  getCollectiveSelector,
  getCollectiveSettingsSelector,
  getI18nSelector,
  canEditGroupSelector
} from '../selectors/collectives';
import {
  getEditCollectiveFormSelector
} from '../selectors/form';


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

const mapStateToProps = createStructuredSelector({
    slug: getSlugSelector,
    collective: getCollectiveSelector,
    canEditCollective: canEditGroupSelector,
    collectiveForm: getEditCollectiveFormSelector,
    //hasHost: !(collective.hosts.length === 0),
    i18n: getI18nSelector,
  });

export default connect(mapStateToProps, {
  appendEditCollectiveForm
})(Collective);
