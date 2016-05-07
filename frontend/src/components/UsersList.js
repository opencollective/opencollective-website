import React from 'react';

import ProfilePhoto from './ProfilePhoto';
import moment from 'moment';

export default ({users=[], i18n}) => {

  const link = (href, title, component) => {
    if(href) {
      return (<a href={href} title={title}>{component}</a>);
    }
    else {
      return component;
    }
  }

  const showUser = (user) => {
    user.tier = user.tier;
    const twitterUrl = user.twitterHandle ? `https://twitter.com/${user.twitterHandle}` : null;
    const href = user.website || twitterUrl;

    user.since = moment(user.createdAt).format('MMMM YYYY');

    const title = `${user.name} {i18n.getString('isA')} ${user.tier} {i18n.getString('since')} ${user.since}`;

    return (
      <div className='UsersList-item' key={user.id}>
        {link(href, title, <ProfilePhoto url={user.avatar} hasBorder={true} />)}
        <div className='UsersList-name'>{link(href, title, user.name)}</div>
        <div className='UsersList-tier'>{user.tier} {i18n.getString('since')} {user.since}</div>
      </div>
    );
  };

  return (
    <div className='UsersList'>
      {users.map(showUser)}
    </div>
  );
};