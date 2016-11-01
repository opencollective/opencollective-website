import React, { Component, PropTypes } from 'react';

import Input from '../../components/Input';
import SaveButton from '../../components/SaveButton';
import ImagePicker from '../../components/ImagePicker';

import { fixURI } from '../../lib/utils';

export default class CollectivePostDonationUserSignup extends Component {

  render() {
    const {
      profileForm,
      updateInProgress,
      save,
      appendProfileForm,
      newUser,
      i18n,
      closeDonationFlow
    } = this.props;

    return (
      <div className='CollectiveDonationFlowWrapper px2 py4 border-box fixed top-0 left-0 right-0 bottom-0'>
        <div className='CollectiveSignup center'>
          <h2 className='CollectiveSignup-title mt2 mb0 -ff-sec -fw-bold'>
            {i18n.getString('thankyou')}
          </h2>
          <p className='Collective-font-17 m0 pt1 -ff-sec -fw-light'>
            {i18n.getString('howDoYouWantToBeShown')}
          </p>

          <div className='max-width-2 mx-auto pt3 mt2'>
            <div className="sm-flex items-stretch">
              <div className="order-2 mb2">
                <div className='pb2 pl2 pr2'>
                  <ImagePicker
                    uploadOptionFirst
                    twitter={profileForm.twitterHandle || newUser.twitterHandle}
                    email={profileForm.email || newUser.email}
                    website={profileForm.website || newUser.website}
                    src={profileForm.avatar || newUser.avatar}
                    className="avatar"
                    handleChange={avatar => appendProfileForm({avatar})}
                    {...this.props} // Pass uploadImage Action from `Collective` container
                  />
                </div>
              </div>
              <div className="sm-col-10 pr1 order-1 content-center">
                <div className='pb20px'>
                  <label className='Collective-font-15 pb1 -fw-normal display-none'>
                    {i18n.getString('displayName')}
                  </label>
                  <Input
                    customClass='-name'
                    type='text'
                    placeholder='Your Name'
                    value={profileForm.name || newUser.name}
                    handleChange={name => appendProfileForm({name})}/>
                </div>
                <div className='pb20px'>
                  <label className='Collective-font-15 pb1 -fw-normal display-none'>
                    <span>{i18n.getString('website')}</span>
                    <span className='pl1 h6 muted'>(Optional)</span>
                  </label>
                  <Input
                    customClass='-website'
                    type='text'
                    placeholder='Website URL (Optional)'
                    value={profileForm.website || newUser.website}
                    handleChange={
                      (website) => {
                        website = fixURI(website);
                        appendProfileForm({website})
                      }
                    }/>
                </div>
                <div className='pb20px'>
                  <label className='Collective-font-15 pb1 -fw-normal display-none'>
                    <span>{i18n.getString('twitter')}</span>
                    <span className='pl1 h6 muted'>(Optional)</span>
                  </label>
                  <Input
                    customClass='-twitter'
                    type='text'
                    placeholder='Twitter Handle (Optional)'
                    value={profileForm.twitterHandle || newUser.twitterHandle}
                    handleChange={twitterHandle => appendProfileForm({twitterHandle})}/>
                </div>
              </div>

            </div>
            <div className="buttonsRow pt3">
              <SaveButton
                save={save.bind(this)}
                label={i18n.getString('save')}
                inProgress={updateInProgress} />
            </div>
          </div>
          <div className="CollectiveSignup center pt3" onClick={ closeDonationFlow }>
            <a href='#'> Return to the collective page </a>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
  }
  
}

CollectivePostDonationUserSignup.propTypes = {
  endFlow: PropTypes.func.isRequired,
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
}
