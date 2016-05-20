import React from 'react';
import env from '../../lib/env';

import OnBoardingStepHeading from './OnBoardingStepHeading';

export default () => (
  <div className="OnBoardingStepConnectGithub">
      <OnBoardingStepHeading step="1/4" title="Connect your GitHub account"/>
      <div style={{margin: '0 auto', marginTop: '40px', width: '300px', textAlign: 'center'}}>
        <a href={`${env.API_ROOT}/connected-accounts/github`}>
          <div className='OnBoardingButton'>Connect GitHub</div>
        </a>
      </div>
  </div>
)
