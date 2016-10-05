import React from 'react';

import PublicGroupDonations from './PublicGroupDonations';
import PublicGroupExpenses from './PublicGroupExpenses';

export default props => (
  <section id='budget' className='px2'>
    <div className='container'>
      <div className='PublicGroup-transactions clearfix md-flex'>
        <PublicGroupExpenses {...props} />
        <PublicGroupDonations {...props} />
      </div>
    </div>
  </section>
)