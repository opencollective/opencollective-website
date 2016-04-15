import React from 'react';

import UserCard from '../../components/UserCard';
import Markdown from '../../components/Markdown';
import { displayUrl } from '../../components/DisplayUrl';

export default class PublicGroupWhoWeAre extends React.Component {
  render() {
    const { group } = this.props;
    let logoElement = null;
    let noLogoClassName = '';

    if (group.logo) {
      logoElement = <img className='PublicGroupIntro-logo mb2 rounded' src={group.logo} />;
    } else {
      noLogoClassName = 'PublicGroupIntro--no-logo bg-no-repeat';
    }

    return (
      <section id='who-we-are' className='PublicGroupIntro px2 bg-light-gray relative'>
        <div className={`PublicGroupIntro-container container center relative ${noLogoClassName}`}>
          {logoElement}
          <h2 className='PublicGroupIntro-title m0 -ff-sec -fw-bold'>We are {group.name}</h2>
          <h3 className='PublicGroup-subtitle mt0 mb2 -ff-sec -fw-light'>{group.description}</h3>
          <div className='PublicGroup-font-15 PublicGroup-quote max-width-3 mx-auto'>
            {group.longDescription && (
              <Markdown className='PublicGroup-quoteText left-align' value={group.longDescription} />
            )}
          </div>

          {group.website && (
            <div className='PublicGroupIntro-website pt3'>
              <a href={group.website} className='px3 -btn -green -btn-outline -btn-small -ttu -ff-sec -fw-bold'>{displayUrl(group.website)}</a>
            </div>
          )}

          {group.members.length ? (
            <div className='PublicGroup-members pt4'>
              <h3 className='PublicGroup-subtitle mt0 mb2 -ff-sec -fw-light'>Core Contributors</h3>
              <div className='flex flex-wrap justify-center'>
                {group.members.map((user, index) => <UserCard user={user} key={index} className='m1' />)}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    );
  }
};
