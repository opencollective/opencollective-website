import React, { Component } from 'react';

import Markdown from '../../components/Markdown';
import RelatedGroups from '../../components/RelatedGroups';
import UserCard from '../../components/UserCard';
import { displayUrl } from '../../components/DisplayUrl';

export default class PublicGroupWhoWeAre extends Component {
  render() {
    const { group, i18n, isSupercollective } = this.props;
    const title = i18n.getString('coreContributors');
    return (
      <section id='who-we-are' className='PublicGroupWhoWeAre PublicGroupIntro'>
        <div className='PublicGroupIntro-container PublicGroupWhoWeAre-container'>
          <h2 className='PublicGroupWhoWeAre-title'>{ i18n.getString('weAre') } { group.name }</h2>
          <h3 ref='PublicGroupWhoWeAre-description' className='PublicGroupWhoWeAre-subtitle'>{ group.description }</h3>

          {group.website && (
            <div className='PublicGroupWhoWeAre-website'>
              <a ref='PublicGroupWhoWeAre-website' href={ group.website } className='px3 -btn -green -btn-outline -btn-small -ttu -ff-sec -fw-bold'>{ displayUrl(group.website) }</a>
            </div>
          )}

          <div ref='PublicGroupWhoWeAre-longDescription' className='PublicGroupWhoWeAre-long-description'>
            {group.longDescription && (
              <Markdown className='PublicGroup-quoteText left-align' value={ group.longDescription } />
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
                {i18n.getString('WeAreProudSupporters')}
              </div>
              <RelatedGroups title={' '} groupList={ group.superCollectiveData } {...this.props} />
            </div>
            ) : null}
        </div>
      </section>
    );
  }
}
