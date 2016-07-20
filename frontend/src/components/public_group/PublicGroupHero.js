import React from 'react';
import LoginTopBar from '../../containers/LoginTopBar';
import formatCurrency from '../../lib/format_currency';
import filterCollection from '../../lib/filter_collection';

export default class PublicGroupHero extends React.Component {

  renderHeroStatistics()
  {
    const { group, i18n } = this.props;
    const yearlyIncome = group.yearlyIncome / 100;
    const formattedYearlyIncome = yearlyIncome && formatCurrency(yearlyIncome, group.currency, { compact: true, precision: 0 });

    let tierCountString;
    const tierCountStringArray = group.tiers.slice()
    .sort((tierA, tierB) => tierB.range[0] - tierA.range[0])
    .map(tier => {
      const count = filterCollection(group.backers, {tier: tier.name}).length;
      return (count) ? `${count} ${count === 1 ? tier.name : `${tier.name}s`}` : '';
    })
    .filter(x => x);

    if (tierCountStringArray.length > 1)
    {
      if (tierCountStringArray.length > 2)
      {
        const lastCountString = tierCountStringArray.pop();
        tierCountString = `${tierCountStringArray.join(', ')} ${i18n.getString('and')} ${lastCountString}`
      }
      else
      {
        tierCountString = tierCountStringArray.join(` ${i18n.getString('and')} `);
      }
    }
    else
    {
      tierCountString = tierCountStringArray[0];
    }

    return (tierCountString &&
      <div className='PublicGroupHero-backer-statistics'>
        <div className='PublicGroupHero-backer-count-text'>
          {i18n.getString('weHave')} {tierCountString}
          {yearlyIncome > 0 && ` ${i18n.getString('thatProvideYearlyBudget')}`}
        </div>
        {yearlyIncome > 0 && (
            <div className='PublicGroupHero-backer-yearly-budget'>
              {formattedYearlyIncome.split('').map((character) => <span className={/[^0-9]/.test(character) ? '-character' : '-digit'}>{character}</span>)}
            </div>
          )
        }
      </div>
    )
  }

  render() {
    const { group, i18n } = this.props;
    const collectiveBg = group.backgroundImage || '/static/images/collectives/default-header-bg.jpg';

    return (
      <section className='PublicGroupHero relative px2 bg-black bg-cover white' style={{backgroundImage: `url(${collectiveBg})`}}>
        <div className='container relative center'>
          <LoginTopBar loginRedirectTo={`/${group.slug}`} classNamxe='pt3 absolute top-0 left-0 right-0' />
          <div className='PublicGroupHero-content'>
            {group.logo && (
              <div className="PublicGroupHero-logo mb3 bg-contain" style={{backgroundImage: `url(${group.logo})`}}></div>
            )}
            <p className='PublicGroup-font-20 mt0 mb2'>{i18n.getString('hiThisIs')} <a href={group.website}>{group.name}</a> {i18n.getString('openCollective')}.</p>
            <h1 className='PublicGroupHero-mission max-width-3 mx-auto mt0 mb3 white -ff-sec'>{i18n.getString('missionTo')} {group.mission}</h1>
            <a href='#support' className='mb3 -btn -btn-big -bg-green -ttu -ff-sec -fw-bold'>{i18n.getString('bePart')}</a>
            {this.renderHeroStatistics()}
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
