import React, { Component } from 'react';

import PublicGroupSignupV2 from './PublicGroupSignupV2';
import PublicGroupThanksV2 from './PublicGroupThanksV2';

import RelatedGroups from '../RelatedGroups';

export default class PublicGroupDonationFlow extends Component {
  render() {
    const {
      group,
      newUser,
      showThankYouMessage,
      showUserForm,
      onSave,
      i18n,
      onCloseDonation,
    } = this.props;

    if (showUserForm) {
      return (
        <div className='PublicGroupDonationFlowWrapper px2 py4 border-box fixed top-0 left-0 right-0 bottom-0 bg-white'>
          <PublicGroupSignupV2 save={ onSave } {...this.props} />
        </div>
      )
    } else if (showThankYouMessage) {
      return (
        <div className='PublicGroupDonationFlowWrapper px2 py4 border-box fixed top-0 left-0 right-0 bottom-0'>
          <PublicGroupThanksV2
            message={ i18n.getString('nowOnBackersWall') }
            i18n={ i18n }
            group={ group }
            newUserId={ newUser.id }
            closeDonationModal={ onCloseDonation } />
          <section className='pt4 center'>
            <RelatedGroups title={ i18n.getString('checkOutOtherSimilarCollectives') } groupList={ group.related } {...this.props} />
          </section>
        </div>
      )
    } else {
      return null;
    }
  }
}