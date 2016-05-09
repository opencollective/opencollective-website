import React from 'react';
import env from '../lib/env';

export default ({ params }) => (
  <a className="connectAccountBtn" href={`${env.API_ROOT}/auth/github/${params.slug}`}>
    Connect to {params.service}
  </a>
);
