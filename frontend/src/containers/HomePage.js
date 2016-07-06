import React, { Component } from 'react';
import { connect } from 'react-redux';
import Numbro from 'numbro';
import 'numbro/dist/languages'

import formatCurrency from '../lib/format_currency';

import OnBoardingHeader from '../components/on_boarding/OnBoardingHeader';
import PublicFooter from '../components/PublicFooter';
import CollectiveCard from '../components/CollectiveCard';

import fetchHome from '../actions/homepage/fetch';

export class HomePage extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchHome } = this.props;
    fetchHome();
  }

  render() {
    const { homepage } = this.props;
    const currency = 'USD';
    const opensource = homepage.collectives ? homepage.collectives.opensource : [];
    const meetup = homepage.collectives ? homepage.collectives.meetup : [];
    const totalCollectives = homepage.stats ? homepage.stats.totalCollectives : 0;
    const totalDonations = homepage.stats ? homepage.stats.totalDonations : 0;
    const totalDonors = homepage.stats ? homepage.stats.totalDonors : 0;

    // opensource.push(1,2,3,4,5,6);
    // meetup.push(1,2,3,4,5,6);

    return (
      <div className='HomePage'>
        <OnBoardingHeader />
        <section className='HomePageHero'>
          <div className='title'>
            <svg width='500px' height='70px' className='align-middle'>
              <use xlinkHref='#svg-logotype' fill='#303233'/>
            </svg>
          </div>
          <div className='subtitle'>organizing the internet generation</div>
          <div className='heading'>Recurring funds for communities.</div>
        </section>
        <section className='HomePageInfo'>
          <div className='heading'>What is a Open Collective?</div>
          <div className='subheading'>An unincorporated association that operates in full transparency</div>          
          <div className='icons-container clearfix'>
            <div className='col sm-col-6 md-col-4'>
              <div className='-graphic -tghost'>&nbsp;</div>
              <div className='-heading'>Transparent</div>
              <div className='-description'>Anyone can follow the money.</div>
            </div>
            <div className='col sm-col-6 md-col-4'>
              <div className='-graphic -oc'>&nbsp;</div>
              <div className='-heading'>Open</div>
              <div className='-description'>Anyone is welcome to join and contribute.</div>
            </div>
            <div className='col sm-col-6 md-col-4'>
              <div className='-graphic -fluid'>&nbsp;</div>
              <div className='-heading'>Fluid</div>
              <div className='-description'>Contributors can change over time.</div>
            </div>
          </div>
        </section>
        <section className='HomePageOpenSource blue-gradient'>
          <div className='heading'>Collectives for <span className='color-blue'>Open Source</span> projects</div>
          <div className='subheading'>These open source projects use Open Collective to share their expenses and let their community chip in.</div>
          <div className='cards'>
            {opensource.map((group, index) => <CollectiveCard 
              key={index}
              id={group.id}
              bg={group.backgroundImage}
              logo={group.logo}
              name={group.name}
              mission={group.mission}
              backerCount={group.backersCount|0}
              sponsorCount={group.sponsorCount|0}
              monthlyIncome={group.monthlyIncome|0}
            />)}
            <a href='/opensource'>See more collectives</a>
          </div>
          <div className='cta'>
            <div className='text'>Have an open source project?</div>
            <a href="/opensource/apply">
              <div className='button color-blue'>create a collective!</div>
            </a>
          </div>
        </section>
        <section className='HomePageMeetups blue-gradient'>
          <div className='heading'>Collectives for <span className='color-green'>meetups</span></div>
          <div className='subheading'>Open Collective empowers local meetups to raise funds and have their own budget.</div>
          <div className='cards'>
            {meetup.map((group, index) => <CollectiveCard 
              key={index}
              id={group.id}
              bg={group.backgroundImage}
              logo={group.logo}
              name={group.name}
              mission={group.mission}
              backerCount={group.backersCount|0}
              sponsorCount={group.sponsorCount|0}
              monthlyIncome={group.monthlyIncome|0}
            />)}
          </div>
          <div className='cta'>
            <div className='text'>We are slowly letting in new kinds of collectives</div>
            <a href="#"><div className='button color-green'>join the waiting list!</div></a>
          </div>
        </section>
        <section className='HomePageNumber'>
          <div className='heading'>Open Numbers</div>
          <div className='numbers-container'>
            <div className='clearfix'>
              <div className='col sm-col-6 md-col-4'>
                <div className='-graphic -tghost'>
                  <div className='-value'>{Numbro(totalCollectives).format('0,0')}</div>
                </div>
                <div className='-heading'>Collectives</div>
              </div>
              <div className='col sm-col-6 md-col-4'>
                <div className='-graphic -oc'>
                  <div className='-value'>{Numbro(totalDonors).format('0,0')}</div>
                </div>
                <div className='-heading'>Backers</div>
              </div>
              <div className='col sm-col-6 md-col-4'>
                <div className='-graphic -fluid'>
                  <div className='-value'>{formatCurrency(totalDonations, currency, { compact: true, precision: 0 })}</div>
                </div>
                <div className='-heading'>Funds collected</div>
              </div>
            </div>
          </div>
          <a href='#'>Learn more about the collectives</a>
        </section>
        <PublicFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, {
  fetchHome
})(HomePage);

function mapStateToProps({ homepage }) {
  return {
    homepage
  }
}
