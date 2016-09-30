import React, { Component } from 'react';

import RelatedGroups from '../../components/RelatedGroups';
import { displayUrl } from '../../components/DisplayUrl';
import ContentEditable from '../../components/ContentEditable';

export default class PublicGroupWhoWeAre extends Component {
  render() {
    const { group, i18n, isSupercollective, canEditGroup, appendEditGroupForm, groupForm } = this.props;

    const {
      name,
      description,
      longDescription
    } = groupForm.attributes;

    return (
      <section id='who-we-are' className='PublicGroupWhoWeAre PublicGroupIntro'>
        <div className='PublicGroupIntro-container PublicGroupWhoWeAre-container'>
          <h2 className='PublicGroupWhoWeAre-title'>{ `${i18n.getString('weAre')} ` }
            <ContentEditable
              tagName='span'
              className='ContentEditable-name editing'
              html={ (name === '' || name) ? name : group.name }
              disabled={ !canEditGroup }
              onChange={ event => appendEditGroupForm({name: event.target.value}) }
              placeholder={i18n.getString('defaultName')} />

          </h2>

          <h3 ref='PublicGroupWhoWeAre-description' className='PublicGroupWhoWeAre-subtitle'>
            <ContentEditable
              className='ContentEditable-description'
              html={ (description === '' || description) ? description : group.description }
              disabled={ !canEditGroup }
              onChange={ event => appendEditGroupForm({description: event.target.value}) }
              placeholder={i18n.getString('defaultDescription')} />
          </h3>

          {group.website && (
            <div className='PublicGroupWhoWeAre-website'>
              <a ref='PublicGroupWhoWeAre-website' href={ group.website } target='_blank' className='px3 -btn -green -btn-outline -btn-small -ttu -ff-sec -fw-bold'>{ displayUrl(group.website) }</a>
            </div>
          )}

          <div ref='PublicGroupWhoWeAre-longDescription' className={`PublicGroupWhoWeAre-long-description`}>
            {group.longDescription && (
              <ContentEditable
                className='ContentEditable-long-description'
                html={ (longDescription === '' || longDescription) ? longDescription : group.longDescription }
                format='markdown'
                disabled={ !canEditGroup }
                onChange={ event => appendEditGroupForm({longDescription: event.target.value}) }
                placeholder={i18n.getString('defaultLongDescription')} />
            )}
          </div>

          {isSupercollective ? (
            <div>
              <div className='Collectives-title mt0 mb2 -ff-sec -fw-light'>
                {i18n.getString('DiscoverOurCollectives', { tag: group.settings.superCollectiveTag})}
              </div>
              <RelatedGroups title={' '} groupList={ group.superCollectiveData } {...this.props} />
            </div>
            ) : null}
        </div>
      </section>
    );
  }
}
