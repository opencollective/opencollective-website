import React, { Component } from 'react';

import fetch from 'isomorphic-fetch';

import LoginTopBar from '../../containers/LoginTopBar';
import exportFile from '../../lib/export_file';

const DEFAULT_BACKGROUND_IMAGE = '/static/images/collectives/default-header-bg.jpg';

export function exportMembers(authenticatedUser, group) {
  const accessToken = localStorage.getItem('accessToken');
  const headers = { authorization: `Bearer ${accessToken}`};

  return fetch(`/api/groups/${group.slug}/users.csv`, { headers })
    .then(response => response.text())
    .then(csv => {
      const d = new Date;
      const mm = d.getMonth() + 1;
      const dd = d.getDate();
      const date =  [d.getFullYear(), (mm < 10) ? `0${mm}` : mm, (dd < 10) ? `0${dd}` : dd].join('');
      const filename = `${date}-${group.slug}-members.csv`;
      exportFile('text/plain;charset=utf-8', filename, csv);
    });
}

export default class PublicGroupHero extends Component {

  render() {
    const { group, i18n, session, hasHost, canEditGroup } = this.props;
    const collectiveBg = group.backgroundImage || DEFAULT_BACKGROUND_IMAGE;
    return (
      <section className='PublicGroupHero relative px2 bg-black bg-cover white' style={{backgroundImage: `url(${collectiveBg})`}}>
        <div className='container relative center'>
          <LoginTopBar loginRedirectTo={ `/${ group.slug }` } />
          <div className='PublicGroupHero-content'>
            {group.logo && (
              <div ref='PublicGroupHero-logo' className='PublicGroupHero-logo mb3 bg-contain' style={{backgroundImage: `url(${ group.logo })`}}></div>
            )}
            <p ref='PublicGroupHero-name' className='PublicGroup-font-20 mt0 mb2'>{ i18n.getString('hiThisIs') } <a href={ group.website }>{ group.name }</a> { i18n.getString('openCollective') }.</p>
            <h1 ref='PublicGroupHero-mission' className='PublicGroupHero-mission max-width-3 mx-auto mt0 mb3 white -ff-sec'>{ i18n.getString('missionTo') } { group.mission }</h1>
            <a href='#support' className='mb3 -btn -btn-big -bg-green -ttu -ff-sec -fw-bold'>{ i18n.getString('bePart') }</a>
            { this.renderContributorCount() }
            <p className='h6'>{ i18n.getString('scrollDown') }</p>
            <svg width='14' height='9'>
              <use xlinkHref='#svg-arrow-down' stroke='#fff'/>
            </svg>
          </div>
        </div>

        <div ref='PublicGroupHero-backgroundImage' className='PublicGroupHero-menu absolute left-0 right-0 bottom-0 xs-hide'>
          <nav>
            <ul className='list-reset m0 -ttu center'>
              <li className='inline-block'>
                <a href='#who-we-are' className='block px2 py3 white -ff-sec -fw-bold'>{ i18n.getString('menuWho') }</a>
              </li>
              <li className='inline-block'>
                <a href='#why-join' className='block px2 py3 white -ff-sec -fw-bold'>{ i18n.getString('menuWhy') }</a>
              </li>
              {hasHost &&
              <li className='inline-block'>
                <a href='#expenses-and-activity' className='block px2 py3 white -ff-sec -fw-bold'>{ i18n.getString('menuExpensesAndActivities') }</a>
              </li> }
              <li className='inline-block'>
                <a href='#members-wall' className='block px2 py3 white -ff-sec -fw-bold'>{ i18n.getString('menuMembersWall') }</a>
              </li>
              { canEditGroup &&
                <li className='inline-block'>
                  <a href='#exportMembers' className='block px2 py3 white -ff-sec -fw-bold' onClick={ exportMembers.bind(this, session.user, group) } >Export members.csv</a>
                </li>
              }
            </ul>
          </nav>
        </div>
      </section>
    );
  }

  renderContributorCount() {
    const { group, i18n } = this.props;
    let contributorText = i18n.getString('contributor').charAt(0).toUpperCase() + i18n.getString('contributor').slice(1);

    if (group.backersCount > 1) {
      contributorText = `${contributorText}s`;
    }

    return group.backersCount > 0 && (
       <div className='PublicGroupHero-contributor-statistics'>
            <div className='PublicGroupHero-contributor-count'>
              {group.backersCount.toString().split('').map((character, index) => {
                return <span key={ index } className={ /[^0-9]/.test(character) ? '-character' : '-digit' }>{ character }</span>
              })} <div className='PublicGroupHero-contributor-count-text'>{ contributorText }</div>
            </div>
      </div>
          )
  }
}
