import React from 'react';
import { Link } from 'react-router';

const ProfileReminder = () => {
  return (
    <div className='Reminder'>
      You haven't set up a Paypal email to receive payments. <br/>
      <Link to='/app/profile'>Click here</Link> to go to your profile page and get started.
    </div>
  );
};

export default ProfileReminder;
