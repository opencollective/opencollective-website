import React from 'react';

import CollectiveCard from './CollectiveCard';
import SponsoredCard from './SponsoredCard';

export default ({
  options,
  user,
  i18n
}) => {

  const backing = user.groups;

  return (
    <div className='ProfileWidget'>

      {backing.length &&
        <section>
          {options.header &&
            <div className='header'>
              <h1>{options.title}</h1>
              <h2>{options.subtitle}</h2>
            </div>
          }
          {backing.map((group, index) => {
            // When sponsored amount & tier exists the `SponsoredCard` will be rendered
            if (group.myTier) {
              return (
                <SponsoredCard tier={group.myTier} index={index} width={140} i18n={i18n} group={group} target="_blank" />
              )
            } else {
              return <CollectiveCard index={index} width={140} i18n={i18n} isCollectiveOnProfile={true} group={group} target="_blank" />
            }
          })}
        </section>
      }

    </div>
  );
}