import React from 'react';

import ShareIcon from '../ShareIcon';
import OnBoardingStepHeading from './OnBoardingStepHeading';

export default class OnBoardingStepThankYou extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      agreedTOS: false,
      expenseDescription: '',
      missionDescription: ''
    }
  }

  render()
  {
    const { onContinue } = this.props;
    const group = {};
    const newUserId = 0;
    const shareUrl = `${group.publicUrl}?referrerId=${newUserId}`;

    return (
      <div className="OnBoardingStepThankYou">
        <img src="/static/images/ghost.svg" width="170px" height="230px"/>
        <OnBoardingStepHeading step="" title="Thank you for submitting your repository" subtitle="Your collective is in the queue - we'll be in touch soon."/>
        <div style={{margin: '20px auto', width: '300px', textAlign: 'center'}}>
          <ShareIcon type='twitter' url={shareUrl} name={group.name} description={group.description} />
          <ShareIcon type='facebook' url={shareUrl} name={group.name} description={group.description} />
          <ShareIcon type='mail' url={shareUrl} name={group.name} description={group.description} />
        </div>
        <div style={{margin: '0 auto', width: '300px', textAlign: 'center'}}>
          <div className='OnBoardingButton' onClick={onContinue}>Explore existing collectives</div>
        </div>
      </div>
    )
  }
}
