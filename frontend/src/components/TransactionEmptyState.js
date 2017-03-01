import React from 'react';

export default ({i18n}) => {
  return (
    <div className='center'>
      <div className='Collective-emptyState-image flex items-center justify-center'>
        <img width='134' height='120'
          src='/public/images/collectives/activities-empty-state-image.jpg'
          srcSet='/public/images/collectives/activities-empty-state-image@2x.jpg 2x'/>
      </div>
      <p className='h3 -fw-bold'>{i18n.getString('transactionsPlaceholderTitle')}</p>
      <p className='h5 muted'>{i18n.getString('transactionsPlaceholderText')}</p>
    </div>
  );
}