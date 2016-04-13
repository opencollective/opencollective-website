import React from 'react';
import PublicTopBarV2 from '../../containers/PublicTopBarV2';

export default class PublicGroupHero extends React.Component {
  render() {
    const { group } = this.props;
    const collectiveBg = '/static/images/collectives/default-header-bg.jpg';

    return (
      <section className='PublicGroupHero relative px2 bg-black bg-cover white' style={{backgroundImage: `url(${collectiveBg})`}}>
        <div className='container relative center'>
          <PublicTopBarV2 loginRedirectTo={`/${group.slug}`} className='pt3 absolute top-0 left-0 right-0' />
          <div className='PublicGroupHero-content'>
            <p className='PublicGroup-font-17 mt0 mb2'>Hi! This is an <span className='-fw-bold'>OpenCollective</span> by <a href={group.website} className='underline white'>{group.name}</a> and we’re on a mission to&hellip;</p>
            <h1 className='PublicGroupHero-mission max-width-3 mx-auto mt0 mb3 white -ff-sec'>{group.mission}</h1>
            <a href='#support' className='mb3 -btn -btn-big -bg-green -ttu -ff-sec -fw-bold'>Be part of it!</a>
            <p className='h6'>Scroll down to find out more.</p>
            <svg width='14' height='9'>
              <use xlinkHref='#svg-arrow-down' stroke='#fff'/>
            </svg>
          </div>
        </div>

        <div className='PublicGroupHero-menu absolute left-0 right-0 bottom-0 xs-hide'>
          <nav>
            <ul className='list-reset m0 -ttu center'>
              <li className='inline-block'>
                <a href="#who-we-are" className='block px2 py3 white -ff-sec -fw-bold'>Who we are</a>
              </li>
              <li className='inline-block'>
                <a href="#why-join" className='block px2 py3 white -ff-sec -fw-bold'>Why join?</a>
              </li>
              <li className='inline-block'>
                <a href="#expenses-and-activity" className='block px2 py3 white -ff-sec -fw-bold'>Expenses and Activity</a>
              </li>
              <li className='inline-block'>
                <a href="#members-wall" className='block px2 py3 white -ff-sec -fw-bold'>Members Wall</a>
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
