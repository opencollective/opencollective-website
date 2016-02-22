import React from 'react';

import ProfilePhoto from './ProfilePhoto';
import moment from 'moment';

export default ({users=[]}) => {

  const link = (href, title, component) => {
    if(href) {
      return (<a href={href} title={title}>{component}</a>);
    }
    else {
      return component;
    }
  }

  const showUser = (user) => {
    user.tier = user.tier || 'backer';
    const twitterUrl = user.twitterHandle ? `https://twitter.com/${user.twitterHandle}` : null;
    const href = user.website || twitterUrl;

    user.since = moment(user.createdAt).format('MMMM YYYY');

    const title = `${user.name} is a ${user.tier} since ${user.since}`;

    return (
      <div className='UsersList-item' key={user.id}>
        {link(href, title, <ProfilePhoto url={user.avatar} hasBorder={true} />)}
        <div className='UsersList-name'>{link(href, title, user.name)}</div>
        <div className='UsersList-tier'>{user.tier} since {user.since}</div>
      </div>
    );
  };

  return (
    <div className='UsersList'>
      {users.map(showUser)}
    </div>
  );
};