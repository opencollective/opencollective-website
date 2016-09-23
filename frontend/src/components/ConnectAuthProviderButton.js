import React from 'react';
import env from '../lib/env';

export default ({params: {slug, provider}, className}) => (
  <a className={`connectAccountBtn ${ className ? className : '' }`} href={`${env.API_ROOT}/connected-accounts/${provider}?slug=${slug}`}>
    Connect to {provider}
  </a>
);
