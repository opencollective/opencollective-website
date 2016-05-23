import React from 'react';
import env from '../../lib/env';

export default () => {
  return (
    <div className='OnBoardingHero'>
      <div className='-title'>
        Apply to create an open collective for your <strong>open source</strong> project.
      </div>
      <div className='-subtitle'>
        We are starting to accept new open collectives. Reserve your spot today.
      </div>
      <div className='-button-container'>
        <a href={`${env.API_ROOT}/connected-accounts/github`}>
          <div className='OnBoardingButton'>Connect GitHub</div>
        </a>
      </div>
      <div className="-requirements">
        You'll need a GitHub account, a repository with over 100 stars that you own & at least 2 contributors.
      </div>
    </div>
  )
}
