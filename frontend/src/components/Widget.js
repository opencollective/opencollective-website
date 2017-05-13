import React from 'react';

import UsersList from './UsersList';
import GroupStatsHeader from './GroupStatsHeader';
import { resizeImage } from '../lib/utils';

export default ({
  options,
  collective,
  i18n,
  href
}) => {

  return (
    <div className='Widget'>
        {options.header && (
          <div className='Widget-header'>
            <img src={resizeImage(collective.logo, { width: 200 })} />
            <h1>{collective.name}</h1>
            <p>{collective.description}</p>
            <GroupStatsHeader group={collective} i18n={i18n} />
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
            <UsersList users={collective.backers} i18n={i18n} />
          </div>
        )}
    </div>
  );
}