import React from 'react';
import env from '../lib/env';

export default ({params}) => (
  <a className="connectAccountBtn" href={`${env.API_ROOT}/connected-accounts/twitter?slug=${params.slug}`}>
    Connect to Twitter
  </a>
);
