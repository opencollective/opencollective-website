import React from 'react';

import ContributorList from './ContributorList';

export default ({contributors}) => ( // .PublicGroupContributors
  <div className='PublicGroup-os-contrib-container'>
    <div className='line1' >{ contributors.length } contributors</div>
    <ContributorList contributors={ contributors } />
  </div>
)
