import React from 'react';

import Input from '../../components/Input';
import SaveButton from '../../components/SaveButton';

export default class PublicGroupSignupV2 extends React.Component {
  componentDidMount() {
    document.body.style.overflow = 'hidden';
  }

  render() {
    const {
      profileForm,
      saveInProgress,
      save,
      appendProfileForm,
      newUser,
      i18n
    } = this.props;

    return (
      <div className='PublicGroupSignupV2 center'>
        <h2 className='PublicGroupSignupV2-title mt1 mb0 -ff-sec -fw-bold'>
          {i18n.getString('thankyou')}
        </h2>
        <p className='PublicGroup-font-17 m0 pt1 -ff-sec -fw-light'>
          {i18n.getString('howDoYouWantToBeShown')}
        </p>
        <div className='max-width-1 mx-auto pt3'>
          <div className='pb2'>
            <label className='PublicGroup-font-15 pb1 -fw-normal'>
              {i18n.getString('displayName')}
            </label>
            <Input
              type='text'
              placeholder='John Appleseed'
              value={profileForm.attributes.name || newUser.name}
              handleChange={name => appendProfileForm({name})}/>
          </div>
          <div className='pb2'>
            <label className='PublicGroup-font-15 pb1 -fw-normal'>
              <span>{i18n.getString('website')}</span>
              <span className='pl1 h6 muted'>(Optional)</span>
            </label>
            <Input
              type='text'
              placeholder='http://'
              value={profileForm.attributes.website || newUser.website}
              handleChange={website => appendProfileForm({website})}/>
          </div>
          <div className='pb2'>
            <label className='PublicGroup-font-15 pb1 -fw-normal'>
              <span>{i18n.getString('twitter')}</span>
              <span className='pl1 h6 muted'>(Optional)</span>
            </label>
            <Input
              type='text'
              placeholder='@username'
              value={profileForm.attributes.twitterHandle || newUser.twitterHandle}
              handleChange={twitterHandle => appendProfileForm({twitterHandle})}/>
          </div>
          <div className="buttonsRow pt3">
            <SaveButton
              save={save.bind(this)}
              label={i18n.getString('save')}
              inProgress={saveInProgress} />
          </div>
        </div>
      </div>
    );
  }
};
