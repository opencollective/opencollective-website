import React, { Component } from 'react';

import Input from '../components/Input';
import SaveButton from '../components/SaveButton';


export class PublicGroupSignup extends Component {
  render() {
    const {
      profileForm,
      saveInProgress,
      users,
      save,
      appendProfileForm,
      newUser
    } = this.props;

    return (
      <div className='PublicGroupSignup'>
        <h2>Thanks for the support </h2>
        <p>How should we show you on the page? </p>

        <div className='Label'> Display Name: </div>
        <Input
          type='text'
          placeholder='Name'
          value={profileForm.attributes.name || newUser.name}
          handleChange={name => appendProfileForm({name})}/>

        <div className='Label'> URL: </div>
        <Input
          type='text'
          placeholder='Website'
          value={profileForm.attributes.website || newUser.website}
          handleChange={website => appendProfileForm({website})}/>

        <div className='Label'> Twitter: </div>
        <Input
          type='text'
          placeholder='twitterUser'
          value={profileForm.attributes.twitterHandle || newUser.twitterHandle}
          handleChange={twitterHandle => appendProfileForm({twitterHandle})}/>
        <div>
          <SaveButton
            save={save.bind(this)}
            inProgress={saveInProgress} />
        </div>

      </div>
    );
  }
}

export default PublicGroupSignup;