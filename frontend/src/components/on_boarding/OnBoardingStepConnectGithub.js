import React from 'react';

import OnBoardingStepHeading from './OnBoardingStepHeading';

export default class OnBoardingStepConnectGithub extends React.Component {

  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (
      <div className="OnBoardingStepConnectGithub">
          <OnBoardingStepHeading step="1/4" title="Connect your GitHub account"/>
          <div style={{margin: '0 auto', marginTop: '40px', width: '300px', textAlign: 'center'}}>
            <a href='/api/connected-accounts/github'>
              <div className='OnBoardingButton'>Connect GitHub</div>
            </a>
          </div>
      </div>
    )
  }
}
