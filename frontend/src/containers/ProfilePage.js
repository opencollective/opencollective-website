import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';
import filterCollection from '../lib/filter_collection';

import LoginTopBar from '../containers/LoginTopBar';
import UserPhoto from '../components/UserPhoto';
import PublicFooter from '../components/PublicFooter';
import CollectiveCard from '../components/CollectiveCard';
import SponsoredCard from '../components/SponsoredCard';
import Markdown from '../components/Markdown';
import ContentEditable from '../components/ContentEditable';
import notify from '../actions/notification/notify';
import Notification from './Notification';

import uploadImage from '../actions/images/upload';
import updateUser from '../actions/users/update';
import validateSchema from '../actions/form/validate_schema';
import profileSchema from '../joi_schemas/profile';
import appendProfileForm from '../actions/form/append_profile';

import { prettyLink } from '../lib/utils';

export class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  saveUser(attribute) {
  const {
      profile,
      updateUser,
      profileForm,
      validateSchema,
      appendProfileForm,
      notify,
    } = this.props;
    appendProfileForm(attribute);
    return validateSchema(profileForm.attributes, profileSchema)
      .then(() => updateUser(profile.id, attribute))
      .catch(({message}) => notify('error', message));
  }

  render() {

    const { profile, i18n, profileForm } = this.props;
    const belongsTo = filterCollection(profile.groups, { role: 'MEMBER' });
    const backing = filterCollection(profile.groups, { role: 'BACKER' });
    const isEmpty = belongsTo.length === backing.length && backing.length === 0;

    const sponsorshipRequirements = `We are supporting the open source community. If you have an open source project, [create an open collective](https://opencollective.com/opensource/apply) and apply to receive sponsorship.`; // Markdown string
    const isSponsoring = [
      'digitalocean', 'auth0', 'saucelabs',
      'pubnub', 'idonethis', 'gitlab'
    ].indexOf(profile.username) !== -1;

    return (
      <div className='ProfilePage'>
        <Notification {...this.props} autoclose/>
        <LoginTopBar />
        <UserPhoto
          editable={profile.canEditUser}
          onChange={(avatar) => this.saveUser({avatar})}
          user={{ avatar: profile.avatar }}
          addBadge={!profile.isOrganization}
          className={`mx-auto ${profile.isOrganization ? 'organization' : ''}`}
          {...this.props}
        />
        {!profile.isOrganization && <div className="line1">Hello I'm</div>}
        {profile.isOrganization && <div className="line1">Hello We are</div>}

        <ContentEditable
              className='line2 ContentEditable-name'
              html={profile.name}
              disabled={!profile.canEditUser}
              onChange={event => this.saveUser({name: event.target.value})}
              placeholder={i18n.getString('defaultName')} />

        <div className="website-twitter">
          <ContentEditable
                className='ContentEditable-website'
                html={profile.canEditUser ? profile.website : prettyLink(profile.website)}
                disabled={!profile.canEditUser}
                multiline={false}
                onChange={event => this.saveUser({website: event.target.value})}
                placeholder={i18n.getString('defaultWebsite')} />
          <ContentEditable
                className='ContentEditable-twitterHandle'
                html={profile.canEditUser ? `@${profile.twitterHandle}` : `<a href="https://twitter.com/${profile.twitterHandle}" target="_blank">@${profile.twitterHandle}</a>`}
                disabled={!profile.canEditUser}
                multiline={false}
                onChange={event => this.saveUser({twitterHandle: event.target.value})}
                placeholder={i18n.getString('defaultTwitterHandle')} />
        </div>

        <ContentEditable
              className='line3 ContentEditable-description'
              html={profile.description}
              format='markdown'
              disabled={!profile.canEditUser}
              onChange={event => this.saveUser({description: event.target.value})}
              placeholder={i18n.getString('defaultDescription')}
              style={{textAlign: 'center'}} />

        {(profile.longDescription || profile.canEditUser) && (
            <Markdown
              value={ (profileForm.attributes.longDescription === '' || profileForm.attributes.longDescription) ? profileForm.attributes.longDescription : profile.longDescription }
              canEdit={profile.canEditUser}
              onChange={longDescription => this.saveUser({ longDescription }) }
              className='line3 longDescription ContentEditable-long-description'
              placeholder={i18n.getString('defaultProfileLongDescription')}
              />
        )}

        {belongsTo.length ? (
            <section>
              <div className="lineA">{i18n.getString('proudMember')}</div>
              {belongsTo.map((group, index) => <CollectiveCard
                index={index}
                i18n={i18n}
                isCollectiveOnProfile={true}
                group={group}
                />
              )}
            </section>
          ) : null
        }
        {backing.length ? (
            <section style={{paddingBottom: '20px'}}>
              <div className="lineA">{profile.isOrganization ? i18n.getString('WeAreProudSupporters') : i18n.getString('IamAProudSupporter')}</div>
              {backing.map((group, index) => {
                // When sponsored amount & tier exists the `SponsoredCard` will be rendered
                if (group.myTier) {
                  return (
                    <SponsoredCard tier={group.myTier} index={index} i18n={i18n} group={group} />
                  )
                } else {
                  return <CollectiveCard isCollectiveOnProfile={true} index={index} i18n={i18n} group={group} />
                }
              })}
            </section>
          ) : null
        }

        {profile.isOrganization && isSponsoring && (
          <div className='Profile-apply'>
            <div className='Profile-apply-container'>
              <div className='Profile-apply-label'>We are receiving sponsorship applications</div>
              <div className='Profile-apply-md-container'>
                <Markdown value={ sponsorshipRequirements } />
              </div>
              <a href={`mailto:info+${profile.username}@opencollective.com`}>
                <div className='Profile-apply-button'>apply for sponsorship</div>
              </a>
            </div>
          </div>
        )}

        {!profile.isOrganization && (
          <div style={{textAlign: 'center', margin: `${isEmpty ? 0 : 48}px auto 78px auto`, opacity: '.4'}} >
            {isEmpty ? (
              <div className="mb1">
                <img src="/public/images/spooky-ghost.svg" />
                <div style={{fontStyle: 'italic', fontFamily: 'Lato', fontSize: '22px', color: '#c0c0c0', textAlign: 'center'}}>This Profile page is so empty you might find a ghost</div>
              </div>
              ) : null
            }
            <svg width='36px' height='36px' className='-light-blue align-middle mr1'>
              <use xlinkHref='#svg-isotype'/>
            </svg>
          </div>
        )}
        <PublicFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, {
  uploadImage,
  validateSchema,
  appendProfileForm,
  notify,
  updateUser
})(ProfilePage);

function mapStateToProps({form}) {

  const profileForm = form.profile;

  return {
    i18n: i18n('en'),
    profileForm
  };
}
