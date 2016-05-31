import React, { Component } from 'react';
import { connect } from 'react-redux';

import OnBoardingHeader from '../components/on_boarding/OnBoardingHeader';
import UserPhoto from '../components/UserPhoto';
import PublicFooter from '../components/PublicFooter';
import ProfileCard from '../components/ProfileCard';

const SAMPLE_BELONGS_T0 = [
  {image: '', title: 'Hackers & Founders ProDev GDL', memberCount: 122, ownerName: 'Sergio De La Garza'},
];
const SAMPLE_BACKING = [
  {image: '', title: 'Hacker Garage', memberCount: 137, ownerName: 'Darius Lau'},
  {image: '', title: 'GeekGirls Guadalajara', memberCount: 73, ownerName: 'Veronica Madrigal'}
];

export class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const avatarUrl = 'https://avatars.githubusercontent.com/carlosascari?s=160';
    const name = 'Scott Murphey';
    const bio = 'Keeping one’s self going is a difficult thing to do. There are a million distractions that occur every day and that can mean that we do not stay on track with what we should be doing. Self-motivation is something that does not come easy to a lot of people and that means that there are some steps that need to be taken before you can become motivated to the fullest extent.';
    const belongsTo = SAMPLE_BELONGS_T0;
    const backing = SAMPLE_BACKING;
    const user = { avatar: avatarUrl };
    const isEmpty = belongsTo.length === backing.length && backing.length === 0;

  	return (
  		<div className='ProfilePage'>
        <OnBoardingHeader />
        <UserPhoto user={user} addBadge={true} className="mx-auto" />
        <div className="line1">Hello I'm</div>
        <div className="line2">{name}</div>
        <div className="line3">{bio}</div>
        {belongsTo.length ? (
            <section>
              <div className="lineA">I proudly belong to these collectives...</div>
              {belongsTo.map((collective, index) => <ProfileCard key={index} image={collective.image} title={collective.title} subtitle={`${collective.memberCount} Members`} footer={`by ${collective.ownerName}`} />)}
            </section>
          ) : null
        }
        {backing.length ? (
            <section style={{paddingBottom: '0'}}>
              <div className="lineA">And happily act as backer of these other collectives...</div>
              {backing.map((collective, index) => <ProfileCard key={index} image={collective.image} title={collective.title} subtitle={`${collective.memberCount} Members`} footer={`by ${collective.ownerName}`} />)}
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

function mapStateToProps() {
  return {};
}
