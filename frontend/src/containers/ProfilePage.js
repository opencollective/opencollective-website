import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import OnBoardingHeader from '../components/on_boarding/OnBoardingHeader';
import UserPhoto from '../components/UserPhoto';
import PublicFooter from '../components/PublicFooter';
import ProfileCard from '../components/ProfileCard';

import filterCollection from '../lib/filter_collection';

export class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const { profile, i18n } = this.props;

    const avatarUrl = profile.avatar;
    const name = profile.name;
    const bio = profile.description;

    const belongsTo = filterCollection(profile.groups, { role: 'MEMBER' });
    const backing = filterCollection(profile.groups, { role: 'BACKER' });
    const user = { avatar: avatarUrl };
    const isEmpty = belongsTo.length === backing.length && backing.length === 0;

  	return (
  		<div className='ProfilePage'>
        <OnBoardingHeader />
        <UserPhoto user={user} addBadge={true} className={`mx-auto ${profile.isOrganization ? 'organization' : ''}`} />
        <div className="line1">Hello I'm</div>
        <div className="line2">{name}</div>
        <div className="line3">{bio}</div>
        {belongsTo.length ? (
            <section>
              <div className="lineA">I proudly belong to these collectives...</div>
              {belongsTo.map((collective, index) => <ProfileCard key={index} image={collective.logo} title={collective.name} subtitle={`${collective.members} Members`} footer={`${i18n.getString('member')} ${i18n.getString('since')} ${i18n.moment(collective.createdAt).format('MMMM YYYY')}`} />)}
            </section>
          ) : null
        }
        {backing.length ? (
            <section style={{paddingBottom: '0'}}>
              <div className="lineA">And happily act as backer of these other collectives...</div>
              {backing.map((collective, index) => <ProfileCard key={index} image={collective.logo} title={collective.name} subtitle={`${collective.members} Members`} footer={`${i18n.getString('backer')} ${i18n.getString('since')} ${i18n.moment(collective.createdAt).format('MMMM YYYY')}`} />)}
            </section> 
          ) : null
        }
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
        <PublicFooter />
  		</div>
  	)
  }
}

export default connect(mapStateToProps, {})(ProfilePage);

function mapStateToProps({}) {
  return {
    i18n: i18n('en')
  };
}
