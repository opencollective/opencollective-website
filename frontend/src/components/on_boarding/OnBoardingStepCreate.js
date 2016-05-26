import React from 'react';

import OnBoardingStepHeading from './OnBoardingStepHeading';
import ImagePicker from '../ImagePicker';
import CustomTextArea from '../CustomTextArea';
import Checkbox from '../Checkbox';

export default class OnBoardingStepCreate extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      agreedTOS: false,
      logo: '',
    }
  }
  
  render() {
    const buttonContainerStyle = {margin: '0 auto', marginTop: '40px', width: '300px', textAlign: 'center'};
    const { uploadImage, appendGithubForm, githubForm, onCreate } = this.props;
    const { agreedTOS } = this.state;

    const missionDescription = githubForm.attributes.missionDescription;
    const expenseDescription = githubForm.attributes.expenseDescription;
    const canCreate = expenseDescription && missionDescription && agreedTOS;

    return (
      <div className="OnBoardingStepCreate">
        <OnBoardingStepHeading step="3/3" title="Why do you want to create a collective?" subtitle="The answers will be public and will help others decide whether to back your project."/>
        <div className="OnBoardingStepCreate-form-container">
          <div className="sm-flex items-stretch">
            <div className="order-2">
              <div className='OnBoardingStepCreate-imagepicker-cont pb3'>
                <ImagePicker
                  uploadOptionFirst
                  className="logo"
                  dontLookupSocialMediaAvatars
                  handleChange={logo => appendGithubForm({logo})}
                  label="Select collective image"
                  uploadImage={uploadImage}
                  presets={['/static/images/repo.svg', '/static/images/code.svg', '/static/images/rocket.svg']}
                />
              </div>
            </div>
            <div className="sm-col-10 order-1 content-center">
              <div className="flex-auto">
                <div className="flex flex-column">
                  <div className="OnBoardingStepCreate-label">Help us on our mission to...</div>
                  <CustomTextArea value={missionDescription} onChange={(value) => appendGithubForm({missionDescription: value})} maxLength={100} placeholder="State the core mission of your collective"/>
                  <div className="OnBoardingStepCreate-label" style={{marginTop: '25px'}}>How are you going to spend the funds?</div>
                  <CustomTextArea value={expenseDescription} onChange={(value) => appendGithubForm({expenseDescription: value})} maxLength={100} placeholder="Development, design, hosting, etc…"/>
                </div>
              </div>            
            </div>
          </div>
          <div className="OnBoardingStepCreate-tos">
            <Checkbox checked={agreedTOS} onChange={(checked) => this.setState({agreedTOS: checked})} />
            <span>Agree to <a href="https://docs.google.com/document/d/1-hajYd7coL05z2LTCOKXTYzXqNp40kPuw0z66kEIY5Y/pub" target='_blank'>Terms &amp; Conditions</a></span>
          </div>
          <div style={buttonContainerStyle}>
            <div className={`OnBoardingButton ${canCreate ? '' : 'disabled'}`} onClick={canCreate && onCreate}>create!</div>
          </div>
        </div>
      </div>
    )
  }
}
