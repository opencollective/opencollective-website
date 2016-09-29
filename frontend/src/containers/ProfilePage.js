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
import { canEditUser } from '../lib/admin';
import ContentEditable from '../components/ContentEditable';

import uploadImage from '../actions/images/upload';
import updateUser from '../actions/users/update';

export class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const { updateUser, profile, i18n, canEditUser } = this.props;

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
        <LoginTopBar />
        <UserPhoto
          editable={canEditUser}
          onChange={(avatar) => updateUser(profile.id, {avatar})}
          user={{ avatar: profile.avatar }}
          addBadge={!profile.isOrganization}
          className={`mx-auto ${profile.isOrganization ? 'organization' : ''}`}
          {...this.props}
        />
        {!profile.isOrganization && <div className="line1">Hello I'm</div>}
        {profile.isOrganization && <div className="line1">Hello We are</div>}

        <ContentEditable
              className='line2 ContentEditable-description'
              html={profile.name }
              disabled={ !canEditUser }
              onChange={ event => updateUser(profile.id, {name: event.target.value}) }
              placeholder={i18n.getString('defaultDescription')} />

        <ContentEditable
              className='line3 ContentEditable-description'
              html={profile.description }
              format='markdown'
              disabled={ !canEditUser }
              onChange={ event => updateUser(profile.id, {description: event.target.value}) }
              placeholder={i18n.getString('defaultDescription')} />

        {profile.longDescription && (
          <ContentEditable
            className='line3 longDescription ContentEditable-long-description'
            html={ profile.longDescription }
            format='markdown'
            disabled={ !canEditUser }
            onChange={ event => updateUser(profile.id, {longDescription: event.target.value}) }
            placeholder={i18n.getString('defaultLongDescription')} />
        )}

        {belongsTo.length ? (
            <section>
              <div className="lineA">{i18n.getString('proudMember')}</div>
              {belongsTo.map((group, index) => <CollectiveCard
                key={index}
                i18n={i18n}
                isCollectiveOnProfile={true}
                {...group}
                />
              )}
            </section>
          ) : null
        }
        {backing.length ? (
            <section style={{paddingBottom: '20px'}}>
              <div className="lineA">{profile.isOrganization ? i18n.getString('WeAreProudSupporters') : i18n.getString('IamAProudSupporter')}</div>
              {backing.map((group, index) => {
                if (profile.isOrganization) {
                  // When sponsored amount & tier exists the `SponsoredCard` will be rendered
                  if (group.sponsoredAmount && group.sponsoredTier) {
                    return (
                      <SponsoredCard
                        key={index}
                        i18n={i18n}
                        isCollectiveOnProfile={true}
                        {...group}
                        amount={group.sponsoredAmount}
                        tier={group.sponsoredTier}
                      />
                    )
                  } else {
                    return <CollectiveCard key={index} i18n={i18n} isCollectiveOnProfile={true} {...group} />
                  }
                } else {
                  return <CollectiveCard key={index} i18n={i18n} isCollectiveOnProfile={true} {...group} />
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
                <img src="/static/images/spooky-ghost.svg" />
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
  updateUser
})(ProfilePage);

function mapStateToProps({
  session,
  profile = {}
}) {
  return {
    i18n: i18n('en'),
    canEditUser: canEditUser(session, profile)
  };
}
