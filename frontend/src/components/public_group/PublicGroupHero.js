import React, { Component } from 'react';

import fetch from 'isomorphic-fetch';

import LoginTopBar from '../../containers/LoginTopBar';
import exportFile from '../../lib/export_file';
import { resizeImage } from '../../lib/utils';
import processMarkdown from '../../lib/process_markdown';

import ContentEditable from '../../components/ContentEditable';
import UserPhoto from '../../components/UserPhoto';


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
    const { group, i18n, session, hasHost, canEditGroup, groupForm, appendEditGroupForm} = this.props;

    const titles = Object.keys(processMarkdown(group.longDescription));

    const getAnchor = (title) => {
      return title.toLowerCase().replace(' ','-').replace(/[^a-z0-9\-]/gi,'')
    }

    // We can override the default style for the cover image of a group in `group.settings`
    // e.g.
    // - to remove default blur: { "style": { "coverImage": { "filter": "none" }}}
    // - to make the background monochrome*: { "style": {"coverImage": {"filter":"brightness(50%) sepia(1) hue-rotate(132deg) saturate(103.2%) brightness(91.2%);" }}}
    // * see http://stackoverflow.com/questions/29037023/how-to-calculate-required-hue-rotate-to-generate-specific-colour
    group.settings.style = group.settings.style || {};
    const coverImage = resizeImage(group.backgroundImage,1024) || DEFAULT_BACKGROUND_IMAGE;
    const coverImageStyle = Object.assign({}, { filter: "blur(4px)", backgroundImage: `url(${coverImage})` }, group.settings.style.coverImage);

    return (
      <section className='PublicGroupHero relative px2 bg-black bg-cover white'>
        <div className='coverImage' style={coverImageStyle} />
        <div className='container relative center'>
          <LoginTopBar loginRedirectTo={ `/${ group.slug }` } />
          <div className='PublicGroupHero-content'>
            <UserPhoto
              editable={canEditGroup}
              onChange={logo => {
                if (logo !== group.logo)
                  return appendEditGroupForm({logo})
              }}
              user={{ avatar: groupForm.attributes.logo || group.logo }}
              className='PublicGroupHero-logo mb3 bg-contain'
              presets={[]}
              {...this.props} />

            <p ref='PublicGroupHero-name' className='PublicGroup-font-20 mt0 mb2'>{ i18n.getString('hiThisIs') }
              <a href={ group.website }> { group.name }</a> { i18n.getString('openCollective') }.
            </p>
            <h1 ref='PublicGroupHero-mission' className='PublicGroupHero-mission max-width-3 mx-auto mt0 mb3 white -ff-sec'>
              { `${i18n.getString('missionTo')} `}
              <ContentEditable
                tagName='span'
                className='ContentEditable-mission editing'
                html={ (groupForm.attributes.mission === '' || groupForm.attributes.mission) ? groupForm.attributes.mission : group.mission }
                disabled={!canEditGroup}
                onChange={event => appendEditGroupForm({mission: event.target.value})}
                placeholder={i18n.getString('defaultMission')}/>
            </h1>
            <a href='#support' className='mb3 -btn -btn-big -bg-green -ttu -ff-sec -fw-bold'>{ i18n.getString('bePart') }</a>
            { this.renderContributorCount() }
            <p className='h6'>{ i18n.getString('scrollDown') }</p>
            <svg width='14' height='9'>
              <use xlinkHref='#svg-arrow-down' stroke='#fff'/>
            </svg>
          </div>
        </div>

        <div ref='PublicGroupHero-backgroundImage' className='PublicGroupHero-menu absolute left-0 right-0 bottom-0'>
          <nav>
            <ul className='list-reset m0 -ttu center'>
              {titles.map(title =>
                <li className='inline-block'>
                  <a href={`#${getAnchor(title)}`} className='block white -ff-sec -fw-bold'>{ title }</a>
                </li>
              )}
              {hasHost &&
                <li className='inline-block'>
                  <a href='#support' className='block white -ff-sec -fw-bold'>{ i18n.getString('menuSupportUs') }</a>
                </li>
              }
              <li className='inline-block'>
                <a href='#budget' className='block white -ff-sec -fw-bold'>{ i18n.getString('menuBudget') }</a>
              </li>
              { canEditGroup &&
                <li className='inline-block xs-hide'>
                  <a href='#exportMembers' className='block white -ff-sec -fw-bold' onClick={ exportMembers.bind(this, session.user, group) } >Export members.csv</a>
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
                return <span key={ index } className='PublicGroupHero-contributor-count-number'>{ character }</span>
              })} <div className='PublicGroupHero-contributor-count-text'>{ contributorText }</div>
            </div>
      </div>
          )
  }
}