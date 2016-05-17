import React, { Component } from 'react';
import { connect } from 'react-redux';

import Notification from '../containers/Notification';

import OnBoardingHeader from '../components/on_boarding/OnBoardingHeader';
import OnBoardingHero from '../components/on_boarding/OnBoardingHero';
import OnBoardingStepConnectGithub from '../components/on_boarding/OnBoardingStepConnectGithub';
import OnBoardingStepPickRepository from '../components/on_boarding/OnBoardingStepPickRepository';
import OnBoardingStepPickCoreContributors from '../components/on_boarding/OnBoardingStepPickCoreContributors';
import OnBoardingStepCreate from '../components/on_boarding/OnBoardingStepCreate';
import OnBoardingStepThankYou from '../components/on_boarding/OnBoardingStepThankYou';

export class OnBoarding extends Component {

  constructor(props) 
  {
    super(props);
    this.state = { step: 0 };
  }

  render() 
  {
    const { step } = this.state;
    return (
      <div className={`OnBoarding ${step ? '-registering' : ''}`}>
        <Notification />
        {step !== 5 && <OnBoardingHeader active={Boolean(step)} />}
        {step === 0 && <OnBoardingHero onClickStart={() => this.setState({step: 1})} />}
        {step === 1 && <OnBoardingStepConnectGithub onNextStep={() => this.setState({step: 2})} />}
        {step === 2 && <OnBoardingStepPickRepository onNextStep={() => this.setState({step: 3})} />}
        {step === 3 && <OnBoardingStepPickCoreContributors onNextStep={() => this.setState({step: 4})} />}
        {step === 4 && <OnBoardingStepCreate onCreate={() => this.setState({step: 5})}/>}
        {step === 5 && <OnBoardingStepThankYou onContinue={() => this.setState({step: 0})}/>}
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(OnBoarding);
function mapStateToProps({})
{
  return {};
}
