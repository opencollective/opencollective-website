import React from 'react';
import env from '../../lib/env';

export default ({ utmSource }) => (
  <div className='OnBoardingHero'>
    <div className='-title'>
      Apply to create an open collective for your <strong>open source</strong> project.
    </div>
    <div className='-subtitle'>
      We are starting to accept new open collectives. Reserve your spot today.
    </div>
    <div className='-button-container'>
      <a href={`${env.API_ROOT}/connected-accounts/github?utm_source=${utmSource}`}>
        <div className='OnBoardingButton'>Connect GitHub</div>
      </a>
    </div>
    <div className="-requirements">
      You'll need a GitHub account, a repository with over 100 stars that you own & at least 2 contributors.
      Please read our Terms of Service <a href="https://docs.google.com/document/d/1-hajYd7coL05z2LTCOKXTYzXqNp40kPuw0z66kEIY5Y/pub">here</a>
    </div>
  </div>
)