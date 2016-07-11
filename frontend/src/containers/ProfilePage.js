import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';
import filterCollection from '../lib/filter_collection';

import OnBoardingHeader from '../components/on_boarding/OnBoardingHeader';
import UserPhoto from '../components/UserPhoto';
import PublicFooter from '../components/PublicFooter';
import CollectiveCard from '../components/CollectiveCard';

export class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const { profile, i18n } = this.props;

    profile.groups.map((group) => {
      group.sponsorCount = filterCollection(group.backers, {tier: 'sponsor'}).length;
      group.backersCount = group.backers.length - group.sponsorCount;
      group.monthlyIncome = (group.yearlyIncome / 12);
    })

    const belongsTo = filterCollection(profile.groups, { role: 'MEMBER' });
    const backing = filterCollection(profile.groups, { role: 'BACKER' });
    const isEmpty = belongsTo.length === backing.length && backing.length === 0;console.log(backing)

  	return (
  		<div className='ProfilePage'>
        <OnBoardingHeader />
        <UserPhoto user={{ avatar: profile.avatar }} addBadge={true} className={`mx-auto ${profile.isOrganization ? 'organization' : ''}`} />
        <div className="line1">Hello I'm</div>
        <div className="line2">{profile.name}</div>
        <div className="line3">{profile.description}</div>
        {belongsTo.length ? (
            <section>
              <div className="lineA">{i18n.getString('proudMember')}</div>
              {belongsTo.map((group, index) => <CollectiveCard 
                key={index}
                id={group.id}
                bg={group.backgroundImage}
                logo={group.logo}
                name={group.name}
                mission={group.mission}
                backerCount={group.backersCount}
                sponsorCount={group.sponsorCount}
                monthlyIncome={group.monthlyIncome} 
                />
              )}
            </section>
          ) : null
        }
        {backing.length ? (
            <section style={{paddingBottom: '0'}}>
              <div className="lineA">{i18n.getString('proudSupporter')}</div>
              {backing.map((group, index) => <CollectiveCard 
                key={index}
                id={group.id}
                bg={group.backgroundImage}
                logo={group.logo}
                name={group.name}
                mission={group.mission}
                backerCount={group.backersCount}
                sponsorCount={group.sponsorCount}
                monthlyIncome={group.monthlyIncome} 
                />
              )}
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
