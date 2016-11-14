import React from 'react';

import filterCollection from '../lib/filter_collection';
import CollectiveCard from './CollectiveCard';
import SponsoredCard from './SponsoredCard';

export default ({
  options,
  profile,
  i18n
}) => {

  const backing = profile.groups; // filterCollection(profile.groups, { role: 'BACKER' });

  return (
    <div className='ProfileWidget'>

      {backing.length &&
        <section>
          <h1>{options.title}</h1>
          <h2>{options.subtitle}</h2>
          {backing.map((group, index) => {
            // When sponsored amount & tier exists the `SponsoredCard` will be rendered
            if (group.myTier) {
              return (
                <SponsoredCard
                  key={index}
                  i18n={i18n}
                  isCollectiveOnProfile={true}
                  {...group}
                  amount={group.myTotalDonations}
                  tier={group.myTier}
                />
              )
            } else {
              return <CollectiveCard key={index} i18n={i18n} isCollectiveOnProfile={true} group={group} />
            }
          })}
        </section>
      }

    </div>
  );
}