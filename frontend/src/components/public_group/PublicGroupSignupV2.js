import React from 'react';

import Input from '../../components/Input';
import SaveButton from '../../components/SaveButton';
import ImagePicker from '../../components/ImagePicker';

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
        <h2 className='PublicGroupSignupV2-title mt2 mb0 -ff-sec -fw-bold'>
          {i18n.getString('thankyou')}
        </h2>
        <p className='PublicGroup-font-17 m0 pt1 -ff-sec -fw-light'>
          {i18n.getString('howDoYouWantToBeShown')}
        </p>

        <div className='max-width-2 mx-auto pt3 mt2'>
          <div className="sm-flex items-stretch">
            <div className="order-2 mb2">
              <div className='pb2 pl2 pr2'>
                <ImagePicker
                  twitter={profileForm.attributes.twitterHandle || newUser.twitterHandle}
                  email={profileForm.attributes.email || newUser.email}
                  website={profileForm.attributes.website || newUser.website}
                  src={newUser.avatar} // TODO pass user avatar, if they already have one. 
                  className="avatar"
                  handleChange={avatar => appendProfileForm({avatar})}
                  {...this.props} // Pass uploadImage Action from `PublicGroup` container
                />
              </div>
            </div>
            <div className="sm-col-10 pr1 order-1 content-center">
              <div className='pb20px'>
                <label className='PublicGroup-font-15 pb1 -fw-normal display-none'>
                  {i18n.getString('displayName')}
                </label>
                <Input
                  type='text'
                  placeholder='Your Name'
                  value={profileForm.attributes.name || newUser.name}
                  handleChange={name => appendProfileForm({name})}/>
              </div>
              <div className='pb20px'>
                <label className='PublicGroup-font-15 pb1 -fw-normal display-none'>
                  <span>{i18n.getString('website')}</span>
                  <span className='pl1 h6 muted'>(Optional)</span>
                </label>
                <Input
                  type='text'
                  placeholder='Website URL (Optional)'
                  value={profileForm.attributes.website || newUser.website}
                  handleChange={
                    (website) => {
                      website = this.fixURI(website);
                      appendProfileForm({website})
                    }
                  }/>
              </div>
              <div className='pb20px'>
                <label className='PublicGroup-font-15 pb1 -fw-normal display-none'>
                  <span>{i18n.getString('twitter')}</span>
                  <span className='pl1 h6 muted'>(Optional)</span>
                </label>
                <Input
                  type='text'
                  placeholder='Twitter Handle (Optional)'
                  value={profileForm.attributes.twitterHandle || newUser.twitterHandle}
                  handleChange={twitterHandle => appendProfileForm({twitterHandle})}/>
              </div>              
            </div>

          </div>
          <div className="buttonsRow pt3">
            <SaveButton
              save={save.bind(this)}
              label="SHOW MY SUPPORT!" //  {/*i18n.getString('save')*/}
              inProgress={saveInProgress} />
          </div>
        </div>
      </div>
    );
  }

  /**
  * Currently, `Joi.string().uri()` Joi is used to validate the website uri. 
  * Unfortunately, a valid URI includes its schema/protocol, so the following urls
  * will always be invalid: `facebook.com/xdamman` & `github.com/xdamman`.
  * 
  * Its a shame, since it is what most internet users will want to type.
  * This functions patches a `http://` protocol if it is missing.
  *
  * @ref https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
  */
  fixURI(weburl)
  {
    weburl = weburl.trim();
    if (weburl && weburl.length > 4)
    {
      if (weburl.indexOf('http') !== 0)
      {
        const matches = /(^(https?)?(:)?(\/*)?)(.*)$/i.exec(weburl);
        weburl = `http://${matches[matches.length - 1]}`; // get w.e is after schema and leading slashes.
      }
    }

    return weburl;
  }
};
