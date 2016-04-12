import React, { Component } from 'react';

import Input from '../components/Input';
import SaveButton from '../components/SaveButton';


export class PublicGroupSignup extends Component {
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
      <div className='PublicGroupSignup clearfix'>
        <h2>{i18n.getString('thankyou')}</h2>
        <p>{i18n.getString('howDoYouWantToBeShown')}</p>
        <form>
          <div className='row'><label>{i18n.getString('displayName')}:</label>
          <Input
            type='text'
            placeholder='John Appleseed'
            value={profileForm.attributes.name || newUser.name}
            handleChange={name => appendProfileForm({name})}/>
          </div>
          <div className='row'><label>{i18n.getString('website')}: </label>
          <Input
            type='text'
            placeholder='http://'
            value={profileForm.attributes.website || newUser.website}
            handleChange={website => appendProfileForm({website})}/>
          </div>
          <div className='row'><label>{i18n.getString('twitter')}: </label>
          <Input
            type='text'
            placeholder='@username'
            value={profileForm.attributes.twitterHandle || newUser.twitterHandle}
            handleChange={twitterHandle => appendProfileForm({twitterHandle})}/>
          </div>
          <div className="buttonsRow">
            <SaveButton
              save={save.bind(this)}
              label={i18n.getString('save')}
              inProgress={saveInProgress} />
          </div>
        </form>
      </div>
    );
  }
}

export default PublicGroupSignup;
