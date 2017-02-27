import React from 'react';

export default ({i18n}) => {
  return (
    <div className='center'>
      <div className='flex items-center justify-center'>
        <img width='111' height='151'
          src='/public/images/collectives/expenses-empty-state-image.jpg'
          srcSet='/public/images/collectives/expenses-empty-state-image@2x.jpg 2x'/>
      </div>
      <p className='h3 -fw-bold'>{i18n.getString('expensesPlaceholderTitle')}</p>
      <p className='h5 muted mb3'>{i18n.getString('expensesPlaceholderText')}</p>
    </div>
  );
}