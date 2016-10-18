import React, { Component, PropTypes } from 'react';

import { Sticky } from 'react-sticky';

import fetch from 'isomorphic-fetch';

import LoginTopBar from '../../containers/LoginTopBar';
import { resizeImage, formatAnchor } from '../../lib/utils';

import ContentEditable from '../../components/ContentEditable';
import UserPhoto from '../../components/UserPhoto';
import GroupStatsHeader from '../../components/GroupStatsHeader';

const DEFAULT_BACKGROUND_IMAGE = '/static/images/collectives/default-header-bg.jpg';

export default class CollectiveHero extends Component {

  render() {
    const { collective, i18n, hasHost, canEditCollective, editCollectiveForm, appendEditCollectiveForm} = this.props;

    // We can override the default style for the cover image of a collective in `collective.settings`
    // e.g.
    // - to remove default blur: { "style": { "coverImage": { "filter": "none" }}}
    // - to make the background monochrome*: { "style": {"coverImage": {"filter":"brightness(50%) sepia(1) hue-rotate(132deg) saturate(103.2%) brightness(91.2%);" }}}
    // * see http://stackoverflow.com/questions/29037023/how-to-calculate-required-hue-rotate-to-generate-specific-colour
    collective.settings.style = collective.settings.style || {};
    const coverImage = resizeImage(collective.backgroundImage,1024) || DEFAULT_BACKGROUND_IMAGE;
    const coverImageStyle = Object.assign({}, { filter: "blur(4px)", backgroundImage: `url(${coverImage})` }, collective.settings.style.coverImage);

    return (
      <section className='CollectiveHero relative px2 bg-black bg-cover white'>
        <div className='coverImage' style={coverImageStyle} />
        <div className='container relative center'>
          <LoginTopBar loginRedirectTo={ `/${ collective.slug }` } />
          <div className='CollectiveHero-content'>
            {collective.logo &&
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

            <p ref='CollectiveHero-name' className='Collective-font-20 mt0 mb2'>{ i18n.getString('hiThisIs') }
              <a href={ collective.website }> { collective.name }</a> { i18n.getString('openCollective') }.
            </p>
            <h1 ref='CollectiveHero-mission' className='CollectiveHero-mission max-width-3 mx-auto mt0 mb3 white -ff-sec'>
              { `${i18n.getString('missionTo')} `}
              <ContentEditable
                tagName='span'
                className='ContentEditable-mission editing'
                html={ (editCollectiveForm.mission === '' || editCollectiveForm.mission) ? editCollectiveForm.mission : collective.mission }
                disabled={!canEditCollective}
                onChange={event => appendEditCollectiveForm({mission: event.target.value})}
                placeholder={i18n.getString('defaultMission')}/>
            </h1>
            <a href='#support' className='mb3 -btn -btn-big -bg-green -ttu -ff-sec -fw-bold'>{ i18n.getString('bePart') }</a>
            <GroupStatsHeader group={ collective } i18n={ i18n } />
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
              {hasHost && collective.tiers &&
                <li className='inline-block'>
                  <a href='#support' className='block white -ff-sec -fw-bold'>{ i18n.getString('menuSupportUs') }</a>
                </li>
              }
              <li className='inline-block'>
                <a href='#budget' className='block white -ff-sec -fw-bold'>{ i18n.getString('menuBudget') }</a>
              </li>
            </ul>
          </nav>
        </Sticky>
      </section>
    );
  }
}


CollectiveHero.propTypes = {
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  editCollectiveForm: PropTypes.object.isRequired,
  appendEditCollectiveForm: PropTypes.func.isRequired,
  hasHost: PropTypes.bool,
  canEditCollective: PropTypes.bool,
};