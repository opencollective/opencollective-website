import React from 'react';
import env from '../lib/env';

export default ({ params }) => (
  <a className="connectAccountBtn" href={`${env.API_ROOT}/connected-accounts/${params.service}`}>
    Connect to {params.service}
  </a>
);
