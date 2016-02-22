import React from 'react';

import ProfilePhoto from './ProfilePhoto';
import { HOST } from '../constants/roles';

export default ({users=[]}) => {

  const profileImageName = (avatar, name) => {
    return (
      <div>
        <ProfilePhoto url={avatar} hasBorder={true} />
        <div className='UsersList-name'>{name}</div>
      </div>
    );
  };

  return (
    <div className='UsersList'>
      {users.map(({id, avatar, name, role, website, twitterHandle}) => {
        const twitterUrl = twitterHandle ? `https://twitter.com/${twitterHandle}` : null;
        const href = website || twitterUrl;

        const title = `${name} is ${role === HOST ? 'the host' : 'a member'}`;

        return (
          <div className='UsersList-item' key={id}>
            {href ? <a href={href} title={title}>{profileImageName(avatar,name)}</a> : profileImageName(avatar,name) }
          </div>
        );
      })}
    </div>
  );
};