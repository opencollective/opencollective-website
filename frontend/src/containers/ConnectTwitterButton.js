import React from 'react';
import env from '../lib/env';

export default () => (
  <a className="connectAccountBtn" href={`${env.API_ROOT}/connected-accounts/twitter?access_token=${localStorage.getItem('accessToken')}`}>
    Connect to Twitter
  </a>
);
