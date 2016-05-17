import React from 'react';

import OnBoardingStepHeading from './OnBoardingStepHeading';
import ImagePicker from '../ImagePicker';
import CustomTextArea from '../CustomTextArea';
import Checkbox from '../Checkbox';

export default class OnBoardingStepCreate extends React.Component {

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
    const { onCreate } = this.props;
    const { agreedTOS, expenseDescription, missionDescription } = this.state;
    const canCreate = expenseDescription && missionDescription && agreedTOS;
    return (
      <div className="OnBoardingStepCreate">
        <OnBoardingStepHeading step="4/4" title="Why do you want to create a collective?" subtitle="The answers will be public and help you motivate people to back your project."/>
        <div className="OnBoardingStepCreate-form-container">
          <div className="OnBoardingStepCreate-label">Help us on our mission to...</div>
          <div className="flex">
            <div className="flex-auto">
              <div className="flex flex-column">
                <CustomTextArea value={missionDescription} onChange={(value) => this.setState({missionDescription: value})} maxLength={100} placeholder="State the collective core mission"/>
                <div className="OnBoardingStepCreate-label" style={{marginTop: '25px'}}>How are you going to spend the funds?</div>
                <CustomTextArea value={expenseDescription} onChange={(value) => this.setState({expenseDescription: value})} maxLength={100} placeholder="Development, design, host, etc…"/>
              </div>
            </div>
            <div>
              <ImagePicker className="logo" label="Select Collective Image" dontLookupSocialMediaAvatars handleChange={Function.prototype}/>
            </div>
          </div>
          <div className="OnBoardingStepCreate-tos">
            <Checkbox checked={agreedTOS} onChange={(checked) => this.setState({agreedTOS: checked})} />
            <span>Agree to <a href="#TOS">Terms &amp; Conditions</a></span>
          </div>
        </div>
        <div style={{margin: '0 auto', marginTop: '40px', width: '300px', textAlign: 'center'}}>
          <div className={`OnBoardingButton ${canCreate ? '' : 'disabled'}`} onClick={canCreate && onCreate}>create!</div>
        </div>
      </div>
    )
  }
}
