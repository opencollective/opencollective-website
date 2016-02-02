import React, { Component } from 'react';

import Input from '../components/Input';
import SaveButton from '../components/SaveButton';


export class PublicGroupSignup extends Component {
  render() {
    const {
      profileForm,
      saveInProgress,
      users
    } = this.props;

    return (
      <div className='PublicGroupSignup'>
        <div>Thanks for the donation. How should we show you on the page? </div>

        <div className='Label'> Display Name: </div>
        <Input
          type = 'text'
          placeholder = 'Name'
          value={profileForm.attributes.name || users.newUser.name}
          handleChange= {this.handleChange.bind(this, 'name')}/>

        <div className='Label'> URL: </div>
        <Input
          type = 'text'
          placeholder = 'Website'
          value={profileForm.attributes.website || users.newUser.website}
          handleChange= {this.handleChange.bind(this, 'website')}/>

        <div className='Label'> Twitter: </div>
        <Input
          type = 'text'
          placeholder = 'twitterUser'
          value={profileForm.attributes.twitterHandle || users.newUser.twitterHandle}
          handleChange= {this.handleChange.bind(this, 'twitterHandle')}/>
        <div>
          <SaveButton
            save={save.bind(this)}
            inProgress={saveInProgress} />
        </div>

      </div>
    );
  }

  handleChange(field, value){
      const attribute = {
        [field]: value
      };
      this.props.appendProfileForm(attribute);
  }
}

export function save() {
    const {
      users,
      updateUser,
      profileForm,
      validateDonationProfile,
      notify,
      pushState,
      groupid,
      slug,
      hideAdditionalUserInfoForm,
      fetchUsers
    } = this.props;

    return validateDonationProfile(profileForm.attributes)
    .then(() => updateUser(users.newUser.id, profileForm.attributes))
    .then(() => hideAdditionalUserInfoForm())
    .then(() => fetchUsers(groupid))
    .then(() => pushState(null, `/${slug}?status=thankyou`))
    .catch(({message}) => notify('error', message));
  };


export default PublicGroupSignup;