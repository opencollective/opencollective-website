import React from 'react';

import UsersList from './UsersList';
import GroupStatsHeader from './GroupStatsHeader';
import { resizeImage } from '../lib/utils';

export default ({
  options,
  group,
  i18n,
  href
}) => {

  return (
    <div className='Widget'>
        {options.header && (
          <div className='Widget-header'>
            <img src={resizeImage(group.logo, { width: 200 })} />
            <h1>{group.name}</h1>
            <p>{group.description}</p>
            <GroupStatsHeader group={group} i18n={i18n} />
          </div>
        )}

        {options.donate && (
          <div className="Widget-donate">
            <a href={href} target="_blank">
              <div className='Button Widget-button'>
                Donate
              </div>
            </a>
          </div>
        )}

        {options.backers && (
          <div className='Widget-backers'>
            <UsersList users={group.backers} i18n={i18n} />
          </div>
        )}
    </div>
  );
}