import React from 'react';

import ShareIcon from '../ShareIcon';
import OnBoardingStepHeading from './OnBoardingStepHeading';

export default class OnBoardingStepThankYou extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const buttonContainerStyle = {margin: '0 auto'};
    const shareButtonsContainerStyle = {margin: '20px auto'};
    const { onContinue } = this.props;
    const group = {};
    const newUserId = 0;
    const shareUrl = `${group.publicUrl}?referrerId=${newUserId}`;

    return (
      <div className="OnBoardingStepThankYou">
        <img src="/public/images/ghost.svg" width="170px" height="230px"/>
        <OnBoardingStepHeading step="" title="Thank you for submitting your repository" subtitle="Your collective is in the queue - we'll be in touch soon."/>
        <div style={shareButtonsContainerStyle}>
          <ShareIcon type='twitter' url={shareUrl} name={group.name} description={group.description} />
          <ShareIcon type='facebook' url={shareUrl} name={group.name} description={group.description} />
          <ShareIcon type='mail' url={shareUrl} name={group.name} description={group.description} />
        </div>
        <div style={buttonContainerStyle}>
          <div className='OnBoardingButton' onClick={onContinue}>Explore existing collectives</div>
        </div>
      </div>
    )
  }
}
