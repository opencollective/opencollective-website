import React, { Component } from 'react';

import Markdown from '../../components/Markdown';
import RelatedGroups from '../../components/RelatedGroups';
import UserCard from '../../components/UserCard';
import { displayUrl } from '../../components/DisplayUrl';
import ContentEditable from '../../components/ContentEditable';

export default class PublicGroupWhoWeAre extends Component {
  render() {
    const { group, i18n, isSupercollective, canEditGroup, appendEditGroupForm, groupForm } = this.props;
    const title = i18n.getString('coreContributors');

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
            {group.longDescription && !canEditGroup && (
              <Markdown className='PublicGroup-quoteText left-align' value={ group.longDescription } />
            )}
            {group.longDescription && canEditGroup && (
              <ContentEditable
                className='ContentEditable-long-description'
                html={ (longDescription === '' || longDescription) ? longDescription : group.longDescription }
                disabled={ !canEditGroup }
                onChange={ event => appendEditGroupForm({longDescription: event.target.value}) }
                placeholder={i18n.getString('defaultLongDescription')} />
            )}
          </div>

          {group.members.length ? (
            <div className='PublicGroup-members pt4'>
              <h3 className='PublicGroup-subtitle mt0 mb2 -ff-sec -fw-light'>{ title }</h3>
              <div ref='PublicGroupWhoWeAre-members' className='flex flex-wrap justify-center'>
                {group.members.map((user, index) => {
                  if (group.slug === 'opensource') user.tier = 'collective';
                  return <UserCard ref={`UserCard-${ index }`}  user={ user } key={ index } className='m1' i18n={ i18n } />
                  })
                }
              </div>
            </div>
          ) : null}

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
