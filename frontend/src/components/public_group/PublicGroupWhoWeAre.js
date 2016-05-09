import React from 'react';

import UserCard from '../../components/UserCard';
import Markdown from '../../components/Markdown';
import { displayUrl } from '../../components/DisplayUrl';

export default class PublicGroupWhoWeAre extends React.Component {
  render() {
    const { group, i18n } = this.props;

    const title = (group.slug === 'opensource') ? '' : i18n.getString('coreContributors');

    return (
      <section id='who-we-are' className='PublicGroupIntro px2 bg-light-gray relative'>
        <div className='PublicGroupIntro-container container center relative PublicGroupIntro--no-logo bg-no-repeat'>
          <h2 className='PublicGroupIntro-title m0 -ff-sec -fw-bold'>{i18n.getString('weAre')} {group.name}</h2>
          <h3 className='PublicGroup-subtitle mt0 mb2 -ff-sec -fw-light max-width-3 mx-auto'>{group.description}</h3>
          
          {group.website && (
            <div className='PublicGroupIntro-website pt1'>
              <a href={group.website} className='px3 -btn -green -btn-outline -btn-small -ttu -ff-sec -fw-bold'>{displayUrl(group.website)}</a>
            </div>
          )}

          <div className='PublicGroup-font-15 PublicGroup-quote max-width-3 mx-auto'>
            {group.longDescription && (
              <Markdown className='PublicGroup-quoteText left-align' value={group.longDescription} />
            )}
          </div>

          {group.members.length ? (
            <div className='PublicGroup-members pt4'>
              <h3 className='PublicGroup-subtitle mt0 mb2 -ff-sec -fw-light'>{title}</h3>
              <div className='flex flex-wrap justify-center'>
                {group.members.map((user, index) => {
                  if(group.slug === 'opensource') user.tier = 'collective';
                  return <UserCard user={user} key={index} className='m1' i18n={i18n} />
                  })
                }
              </div>
            </div>
          ) : null}
        </div>
      </section>
    );
  }
};
