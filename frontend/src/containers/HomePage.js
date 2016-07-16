import React, { Component } from 'react';
import { connect } from 'react-redux';
import Numbro from 'numbro';
import 'numbro/dist/languages'

import filterCollection from '../lib/filter_collection';
import formatCurrency from '../lib/format_currency';

import OnBoardingHeader from '../components/on_boarding/OnBoardingHeader';
import PublicFooter from '../components/PublicFooter';
import CollectiveCard from '../components/CollectiveCard';

import fetchHome from '../actions/homepage/fetch';

const mapCollectiveCardProps = group => {
  group.mission = `We are on a mission to ${group.mission}`;
  group.stats = [];

  if(group.contributors && Object.keys(group.contributors).length > 0)
    group.stats.push({ label: 'contributors', value: Object.keys(group.contributors).length });
  else
    group.stats.push({ label: 'members', value: group.members.length });

  group.stats.push({ label: 'backers', value: group.backers.length });
  group.stats.push({ label: 'yearly income', value: formatCurrency(group.yearlyIncome/100, group.currency, { compact: true, precision: 0 }) });

  return group;
};

const mapSponsorsCardProps = sponsor => {
  sponsor.publicUrl = `/${sponsor.username}`;
  sponsor.mission = `We are on a mission to ${sponsor.mission}`;
  sponsor.stats = [{
    label: 'collectives',
    value: sponsor.collectives
  },{
    label: 'donations',
    value: formatCurrency(sponsor.totalDonations, sponsor.currency, { compact: true, precision: 0 })
  }];
  return sponsor;
};

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
    const sponsors = homepage.sponsors ? homepage.sponsors : [];

    const totalCollectives = homepage.stats ? homepage.stats.totalCollectives : 0;
    const totalDonations = homepage.stats ? homepage.stats.totalDonations : 0;
    const totalDonors = homepage.stats ? homepage.stats.totalDonors : 0;

    opensource.map(mapCollectiveCardProps);
    meetup.map(mapCollectiveCardProps);
    sponsors.map(mapSponsorsCardProps);

    return (
      <div className='HomePage'>
        <OnBoardingHeader />
        <section className='HomePageHero'>
          <div className='title'>
            <svg width='500px' height='70px' className='align-middle'>
              <use xlinkHref='#svg-logotype' fill='#303233'/>
            </svg>
          </div>
          <div className='subtitle'>organizing the Internet generation</div>
          <div className='heading'>Collect money for your community, transparently.</div>
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
              <div className='-description'>Leaders can change over time.</div>
            </div>
          </div>
        </section>
        <section className='HomePageOpenSource blue-gradient'>
          <div className='heading'>Collectives for <span className='color-blue'>Open Source</span> projects</div>
          <div className='subheading'>These open source projects have created open collectives to share their expenses and let their community chip in.</div>
          <div className='cards'>
            {opensource.map(group => <CollectiveCard 
              key={group.id}
              bg={group.backgroundImage}
              logo={group.logo}
              name={group.name}
              description={group.mission || group.description}
              url={group.publicUrl}
              stats={group.stats}
            />)}
            <a href='/opensource' className='seemore'>See more collectives</a>
          </div>
          <div className='cta'>
            <div className='text'>Have an open source project?</div>
            <a href="/opensource/apply">
              <div className='button color-blue'>apply to create a collective!</div>
            </a>
          </div>
        </section>
        <section className='HomePageMeetups blue-gradient'>
          <div className='heading'>Collectives for <span className='color-green'>meetups</span></div>
          <div className='subheading'>Open Collective empowers local meetups to raise funds and have their own budget.</div>
          <div className='cards'>
            {meetup.map(group => <CollectiveCard 
              key={group.id}
              bg={group.backgroundImage}
              logo={group.logo}
              name={group.name}
              description={group.mission}
              url={group.publicUrl}
              stats={group.stats}
            />)}
          </div>
          <div className='cta'>
            <div className='text'>We are slowly letting in new kinds of collectives</div>
            <div className='button color-green'><a href="mailto:info@opencollective.com?subject=join%20waiting%20list">join the waiting list!</a></div>
          </div>
        </section>
        <section className='HomePageSponsors blue-gradient'>
          <div className='heading'>Sponsors</div>
          <div className='subheading'>Collectives do amazing things for their communities thanks to those awesome sponsors.</div>
          <div className='cards'>
            {sponsors.map(sponsor => <CollectiveCard 
              key={sponsor.id}
              bg={sponsor.backgroundImage}
              className='sponsor'
              logo={sponsor.logo}
              name={sponsor.name}
              description={sponsor.mission}
              url={sponsor.publicUrl}
              stats={sponsor.stats}
            />)}
          </div>
          <div className='cta'>
            <div className='text'>Become a sponsor and reach out to the right communities</div>
            <div className='button color-green'><a href="mailto:info@opencollective.com?subject=become%20a%20sponsor">become a sponsor</a></div>
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
          {false && <a href='#'>Learn more about the collectives</a> }
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
