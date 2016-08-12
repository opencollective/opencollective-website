import React from 'react';
import env from '../lib/env';

export default ({params: {slug, provider}}) => (
  <a className="connectAccountBtn" href={`${env.API_ROOT}/connected-accounts/${provider}?slug=${slug}`}>
    Connect to {provider}
  </a>
);
