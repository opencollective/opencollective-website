import React, { Component, PropTypes } from 'react';

import { Sticky } from 'react-sticky';

import LoginTopBar from '../../containers/LoginTopBar';
import { exportMembers } from '../../lib/export_file';
import { resizeImage } from '../../lib/utils';

import ContentEditable from '../../components/ContentEditable';
import UserPhoto from '../../components/UserPhoto';
import UserAvatarRow from '../../components/UserAvatarRow';
import CollectiveStatsHeader from '../../components/collective/CollectiveStatsHeader';

export default class CollectiveHero extends Component {

  render() {
    const { collective, subCollectives, host, i18n, canEditCollective, editCollectiveForm, appendEditCollectiveForm, loggedinUser} = this.props;

    return (
      <section className='CollectiveHero relative px2 bg-black bg-cover white'>
        <div className='coverImage' style={collective.settings.style.hero.cover} />
        <div className='container relative center'>
          <LoginTopBar loginRedirectTo={ `/${ collective.slug }` } />
          <div className='CollectiveHero-content'>
            {collective.logo && canEditCollective && 
              <UserPhoto
                editable={canEditCollective}
                onChange={logo => {
                  if (logo !== collective.logo)
                    return appendEditCollectiveForm({logo})
                }}
                user={{ avatar: editCollectiveForm.logo || collective.logo }}
                className='CollectiveHero-logo mb3 bg-contain'
                presets={[]}
                {...this.props} />
            }

            {collective.logo && !canEditCollective &&
              <img src={resizeImage(collective.logo, { height: 320 })} className='CollectiveHero-logo mb3 bg-contain' />
            }

            <p ref='CollectiveHero-name' className='Collective-font-20 mt0 mb2'>{ i18n.getString('hiThisIs') }
              <a href={ collective.website } style={ collective.settings.style.hero.a } target="_blank"> { collective.name }</a> { i18n.getString('openCollective') }.
            </p>
            <h1 ref='CollectiveHero-mission' className='CollectiveHero-mission max-width-3 mx-auto mt0 mb3 white -ff-sec'>
              <ContentEditable
                tagName='span'
                className='ContentEditable-mission editing'
                html={ (editCollectiveForm.mission === '' || editCollectiveForm.mission) ? editCollectiveForm.mission : collective.mission }
                disabled={!canEditCollective}
                onChange={event => appendEditCollectiveForm({mission: event.target.value})}
                placeholder={i18n.getString('defaultMission')}/>
            </h1>

            <UserAvatarRow members={ collective.members } backers={ collective.backers } otherCount={ collective.contributorsCount } />

            <CollectiveStatsHeader collective={ collective } i18n={ i18n } />

            {collective.isActive && 
              <a href='#support' className='mb3 -btn -btn-big -bg-green -ttu -ff-sec -fw-bold'>{ i18n.getString('bePart') }</a>
            }
            {!collective.isActive && host &&
              <div className="underReview">This collective is currently under review by the host (<a href={host.website}>{host.name}</a>)</div>
            }

            <div className='scrollDown'>
              <p className='h6'>{ i18n.getString('scrollDown') }</p>
              <svg width='14' height='9'>
                <use xlinkHref='#svg-arrow-down' stroke='#fff'/>
              </svg>
            </div>
          </div>
        </div>

        <Sticky stickyStyle={{width:'100%',left:0}} ref='CollectiveHero-backgroundImage' className='CollectiveHero-menu absolute left-0 right-0 bottom-0'>
          <nav>
            <ul className='list-reset m0 -ttu center'>
              <li className='inline-block'>
                <a href='#budget' className='block white -ff-sec -fw-bold'>{ i18n.getString('menuBudget') }</a>
              </li>
              <li className='inline-block'>
                <a href='#about_us' className='block white -ff-sec -fw-bold'>{ i18n.getString('menuAboutUs') }</a>
              </li>
              { subCollectives  && subCollectives.length > 0 &&
                <li className='inline-block'>
                  <a href='#collectives' className='block white -ff-sec -fw-bold'>{ i18n.getString('collectives') }</a>
                </li>
              }
              <li className='inline-block'>
                <a href='#contributors' className='block white -ff-sec -fw-bold'>{ i18n.getString('contributors') }</a>
              </li>
              { canEditCollective &&
                <li className='inline-block xs-hide'>
                  <a href={`/${collective.slug}/events/new`} className='block white -ff-sec -fw-bold'>Create an Event</a>
                </li>
              }
              { collective.backersCount > 0 && canEditCollective &&
                <li className='inline-block xs-hide'>
                  <a href='#exportMembers' className='block white -ff-sec -fw-bold' onClick={ exportMembers.bind(this, loggedinUser, collective) } >Export members.csv</a>
                </li>
              }
            </ul>
          </nav>
        </Sticky>
      </section>
    );
  }
}


CollectiveHero.propTypes = {
  collective: PropTypes.object.isRequired,
  host: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  editCollectiveForm: PropTypes.object.isRequired,
  appendEditCollectiveForm: PropTypes.func.isRequired,
  canEditCollective: PropTypes.bool,
};