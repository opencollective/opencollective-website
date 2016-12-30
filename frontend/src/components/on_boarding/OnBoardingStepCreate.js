import React, { PropTypes } from 'react';

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
      disableCreateButton: false
    }
  }

  render() {
    const buttonContainerStyle = {margin: '0 auto', marginTop: '40px', width: '300px', textAlign: 'center'};
    const { uploadImage, appendGithubForm, githubForm, i18n } = this.props;
    const { agreedTOS } = this.state;

    const { mission } = githubForm.attributes;
    const { description } = githubForm.attributes;
    const canCreate = mission && description && agreedTOS;

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
                  i18n={i18n}
                  presets={['/static/images/repo.svg', '/static/images/code.svg', '/static/images/rocket.svg']}
                />
              </div>
            </div>
            <div className="sm-col-10 order-1 content-center">
              <div className="flex-auto">
                <div className="flex flex-column">
                  <div className="OnBoardingStepCreate-label">Help us on our mission to...</div>
                  <CustomTextArea name={'mission'} value={mission} onChange={(value) => appendGithubForm({mission: value})} maxLength={100} placeholder="Usually starts with: 'We are on a mission to ...'"/>
                  <div className="OnBoardingStepCreate-label">Describe your project </div>
                  <CustomTextArea name={'description'} value={description} onChange={(value) => appendGithubForm({description: value})} maxLength={255} placeholder="Native AngularJS implementation. Performs well with large data sets; even 10,000+ rows."/>
                </div>
              </div>
            </div>
          </div>
          <div className="OnBoardingStepCreate-tos">
            <Checkbox checked={agreedTOS} onChange={(checked) => this.setState({agreedTOS: checked})} />
            <span>Agree to <a href="https://docs.google.com/document/d/1-hajYd7coL05z2LTCOKXTYzXqNp40kPuw0z66kEIY5Y/pub" target='_blank'>Terms &amp; Conditions</a></span>
          </div>
          <div style={buttonContainerStyle}>
            <div className={`OnBoardingButton ${canCreate ? '' : 'disabled'}`} onClick={canCreate && this.onCreate.bind(this)}>create!</div>
          </div>
        </div>
      </div>
    )
  }

  onCreate() {
    if (!this.state.disableCreateButton) {
      this.props.onCreate();
      this.setState({disableCreateButton: true});
      setTimeout(() => this.setState({disableCreateButton: false}), 5000);
    }
  }
}

OnBoardingStepCreate.propTypes = {
  i18n: PropTypes.func.isRequired
};