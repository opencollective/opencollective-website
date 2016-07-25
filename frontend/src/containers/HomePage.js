import React, { Component } from 'react';
import { connect } from 'react-redux';
import Numbro from 'numbro';
import 'numbro/dist/languages'

import formatCurrency from '../lib/format_currency';
import i18n from '../lib/i18n';

import LoginTopBar from '../containers/LoginTopBar';
import MailChimpInputSection from '../components/homepage/MailChimpInputSection';
import PublicFooter from '../components/PublicFooter';
import CollectiveCard from '../components/CollectiveCard';

import fetchHome from '../actions/homepage/fetch';


export class HomePage extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchHome, loadData} = this.props;

    if (loadData) {
      fetchHome();
    }
  }

  render() {
    const { homepage, i18n } = this.props;
    const currency = 'USD';
    const opensource = homepage.collectives ? homepage.collectives.opensource : [];
    const meetup = homepage.collectives ? homepage.collectives.meetup : [];
    const sponsors = homepage.sponsors ? homepage.sponsors : [];

    const totalCollectives = homepage.stats ? homepage.stats.totalCollectives : 0;
    const totalDonations = homepage.stats ? homepage.stats.totalDonations : 0;
    const totalDonors = homepage.stats ? homepage.stats.totalDonors : 0;

    return (
      <div className='HomePage'>
        <LoginTopBar />
        <section className='HomePageHero'>
          <div className='title'>
            <svg width='500px' height='70px' className='align-middle'>
              <use xlinkHref='#svg-logotype' fill='#303233'/>
            </svg>
          </div>
          <div className='subtitle'>organizing the Internet</div>
          <div className='heading'>Collect money for your community, transparently.</div>
        </section>
        <section className='HomePageInfo' id="howitworks">
          <div className='heading'>What is an open collective?</div>
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
        <section className='HomePageOpenSource blue-gradient' id="opensource">
          <div className='heading'>Collectives for <span className='color-blue'>Open Source</span> projects</div>
          <div className='subheading'>These open source projects have created open collectives to share their expenses and let their community chip in.</div>
          <div className='cards'>
            {opensource.map(group => <CollectiveCard
              key={group.id}
              i18n={i18n}
              {...group}
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
        <section className='HomePageMeetups blue-gradient' id="meetups">
          <div className='heading'>Collectives for <span className='color-green'>meetups</span></div>
          <div className='subheading'>Open Collective empowers local meetups to raise funds and have their own budget.</div>
          <div className='cards'>
            {meetup.map(group => <CollectiveCard
              key={group.id}
              i18n={i18n}
              {...group}
            />)}
          </div>
          <div className='cta' id='apply'>
            <div className='text'>We are slowly letting in new kinds of collectives</div>
            <div className='button color-green'>join the waiting list!</div>
          </div>
        </section>
        <MailChimpInputSection mcListId="14d6233180" />
        <section className='HomePageSponsors blue-gradient' id="sponsors">
          <div className='heading'>Sponsors</div>
          <div className='subheading'>Collectives do amazing things for their communities thanks to these awesome sponsors.</div>
          <div className='cards'>
            {sponsors.map(sponsor => <CollectiveCard
              key={sponsor.id}
              i18n={i18n}
              publicUrl={`/${sponsor.username}`}
              isSponsor={true}
              {...sponsor}
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
        </section>
        <PublicFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, {
  fetchHome
})(HomePage);

function mapStateToProps({ homepage, app}) {
  return {
    homepage,
    i18n: i18n('en'),
    loadData: app.rendered
  }
}
