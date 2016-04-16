import React from 'react';
import PublicTopBarV2 from '../../containers/PublicTopBarV2';

export default class PublicGroupHero extends React.Component {
  render() {
    const { group, i18n } = this.props;
    const collectiveBg = group.backgroundImage || '/static/images/collectives/default-header-bg.jpg';

    return (
      <section className='PublicGroupHero relative px2 bg-black bg-cover white' style={{backgroundImage: `url(${collectiveBg})`}}>
        <div className='container relative center'>
          <PublicTopBarV2 loginRedirectTo={`/${group.slug}`} className='pt3 absolute top-0 left-0 right-0' />
          <div className='PublicGroupHero-content'>
            <p className='PublicGroup-font-20 mt0 mb2'>{i18n.getString('hiThisIs')} <a href={group.website}>{group.name}</a> {i18n.getString('openCollective')}.</p>
            <h1 className='PublicGroupHero-mission max-width-3 mx-auto mt0 mb3 white -ff-sec'>{i18n.getString('missionTo')} {group.mission}</h1>
            <a href='#support' className='mb3 -btn -btn-big -bg-green -ttu -ff-sec -fw-bold'>{i18n.getString('bePart')}</a>
            <p className='h6'>{i18n.getString('scrollDown')}</p>
            <svg width='14' height='9'>
              <use xlinkHref='#svg-arrow-down' stroke='#fff'/>
            </svg>
          </div>
        </div>

        <div className='PublicGroupHero-menu absolute left-0 right-0 bottom-0 xs-hide'>
          <nav>
            <ul className='list-reset m0 -ttu center'>
              <li className='inline-block'>
                <a href="#who-we-are" className='block px2 py3 white -ff-sec -fw-bold'>{i18n.getString('menuWho')}</a>
              </li>
              <li className='inline-block'>
                <a href="#why-join" className='block px2 py3 white -ff-sec -fw-bold'>{i18n.getString('menuWhy')}</a>
              </li>
              <li className='inline-block'>
                <a href="#expenses-and-activity" className='block px2 py3 white -ff-sec -fw-bold'>{i18n.getString('menuExpensesAndActivities')}</a>
              </li>
              <li className='inline-block'>
                <a href="#members-wall" className='block px2 py3 white -ff-sec -fw-bold'>{i18n.getString('menuMembersWall')}</a>
              </li>
              {/*<li className='inline-block'>
                <a href="#" className='block px2 py3 white -ff-sec -fw-bold'>Share</a>
              </li>*/}
            </ul>
          </nav>
        </div>
      </section>
    );
  }
};
