import React from 'react';
import moment from 'moment';
import ProfilePhoto from './ProfilePhoto';

export default ({transaction, commenter}) => {
  const date = moment(transaction.createdAt).format('MMMM Do YYYY, h:mm a');

  return (
    <div className='TransactionComment'>
      <ProfilePhoto url={commenter.avatar} />
      <div className='TransactionComment-content'>
        <div className='TransactionComment-date'>
          {date}
        </div>
        <div className='TransactionComment-fullName'>
          {commenter.name}
        </div>
        <div className='TransactionComment-comment'>
          {transaction.comment}
        </div>
      </div>
    </div>
  );
};
