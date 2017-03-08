import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';

export class Faq extends Component {

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
    return (
      <div className='Faq Page'>
        <LoginTopBar />
        <div className="Page-container">
          <h1>FAQ</h1>

          <h3>What is an Open Collective?</h3>
          <p>An Open Collective is a group of people with a shared mission that operates in full transparency. Everyone can see how they receive or spend money.</p>

          <h3>What can I do with Open Collective?</h3>
          <ul>
            <li>Set up a page to collect membership fees or donations (<a href="https://opencollective.com/RailsGirlsAtl">like this one</a>)</li>
            <li>Let your members submit expenses and reimburse them with a click (<a href="https://opencollective.com/RailsGirlsAtl/expenses/new">example</a>)</li>
            <li>Give everyone visibility on your budget (<a href="https://opencollective.com/RailsGirlsAtl#budget">example</a>)</li>
          </ul>
          <p>If you have an organization, you can use Open Collective to empower local chapters to raise money locally and have their own budget. See <a href="#organizations">Open Collective For Organizations</a>.</p>

          <h3>What is Open Collective good for?</h3>
          <p>Open Collective is perfect for any side project that is not for profit. Side projects should be fun. You shouldn't have to worry about creating and maintaining a legal entity, doing bookkeeping, etc. as soon as you need to collect money to reimburse your expenses. Open Collective is ideal for meetups, open source projects, parent associations, neighborhood associations, clubs, unions, movements, non-profits, business incubators, etc.</p>

          <h3>Why should I use Open Collective?</h3>
          <p>Open Collective makes it easy to be transparent about your finances. We help you collect money <em>recurringly</em> for your community. Think about funding an ongoing open source software, collecting dues for a parent association or charge a monthly fee for your food coop. Once you have the money on Open Collective, it’s easy to spend it and everyone can see how it’s being spent. We believe that financial transparency in a community will create stronger and more efficient collaboration among people.</p>

          <h3>How is that different from other crowdfunding platforms?</h3>
          <p>Two major differences:</p>
          <ul>
            <li>Open Collective helps you raise money recurringly (e.g. monthly) to finance the activities of your community. That way, you can plan your future activities against your anticipated monthly budget.</li>
            <li>Open Collective allows (and encourages) full transparency and accountability of the money raised. Other platforms hand over the money without showing to the backers how their money is used. On Open Collective, in order to use the money, you submit an expense for everyone to see. We believe transparency leads to healthier organizations.</li>
          </ul>

          <h3>How does it work?</h3>
          <p>When you create a collective, the money collected goes to the bank account associated with the collective. Whenever you –or a member of the collective– wants to use the money, they submit an expense on the public page of your collective (<a href="https://opencollective.com/railsgirlsatl/expenses/new">like this one</a>). Once you approve it, the person who submitted the expense is automatically reimbursed on their personal PayPal account. The budget and all the expenses are visible publicly.</p>

          <h3>How much does it cost?</h3>
          <p>Open Collective takes 10% of the money raised by the collective for managing their bookkeeping, taxes, and the admin of reimbursing their expenses. We share this commission with the fiscal sponsor (legal owner of the bank account that holds the money on behalf of the collective).</p>
          <p>Additionally, our payment processors charge a fee - Stripe for receiving money via a Credit Card and PayPal for paying out expenses. Usually 2.9% + $0.30 per transaction. We are exploring adding other means of payments, including ACH transfers and Bitcoin, to reduce those fees.</p>

          <h3 id="organizations">What is Open Collective For Organizations?</h3>
          <p>Open Collective for Organizations allows you to empower local chapters to raise money and have their own budget without having to open a separate bank account. No more asking a local sponsor to directly pay for the pizzas! See how <a href="https://opencollective.com/wwcode">Women Who Code uses Open Collective</a>.</p>

          <h4 sstyle="margin-left:40px">How does it work?</h4>
          <p sstyle="margin-left:40px">Open Collective sits on top of the Stripe and PayPal account of your organization. It creates virtual groups for each of your chapters. Each have their own dedicated page and independent budget (see for example <a href="https://opencollective.com/wwcodeaustin">Women Who Code Austin</a>). This empowers them to raise money on their own (and you can opt in to keep a percentage for the main organization). Legally speaking, this is the equivalent of acting as a "Fiscal Sponsor".</p>

          <h4 sstyle="margin-left:40px">How much does Open collective for Organizations cost?</h4>
          <p sstyle="margin-left:40px">We are currently in private beta. Contact hello@opencollective.com and we'll work with you.</p>

          <h3>What happens to the money if I close my account?</h3>
          <p>The money in your PayPal account associated with your Open Collective stays there.</p>
          
          <h3>Is there a minimum time we have to keep our Open Collective running?</h3>
          <p>No minimum time is required.</p>
          
          <h3>How do I make a donation?</h3>
          <p>You rock! We are delighted you are asking this question. Go to the Collective’s Public Page (e.g. https://opencollective.com/wwcodeatl), choose your recurring donation amount and hit the Back Us or Donate button, fill out the form et voilà! Now you are part of that collective, your community will appreciate it.</p>
          
          <h3 id="expense">How do I submit an expense?</h3>
          <p>Go to your Collective page to submit an expense. You will need to upload a valid image for it to get reimbursed. Don’t forget to include your paypal email if it’s different from your user email.</p>
          <p>There are two ways of using your Collective’s money:
            <ul>
              <li>Submit a receipt for something you paid like online services, meals, plane tickets, etc.</li>
              <li>Submit an invoice for your work. The invoice must include your current address and be made to Open Collective Inc. (or to the host if you are hosted by another organisation) with reference to your collective. The invoice is only visible to the host and core contributors, it is not public.</li>
             </ul>
          </p>
          <p>Expenses will be paid once a week on Fridays. Please contact <a href="mailto:support@opencollective.com">Support</a> if you have any questions.</p> 
          <p>Open Collective’s details:</p> 
          <p>
            OpenCollective, Inc.<br />
            EIN: 47-3896707<br />
            340 S LEMON AVE #3717<br />
            Walnut CA 91789<br />
            USA
          </p>
          
          <h3>Why do you have monthly payments as default?</h3>
          <p>A collective is an organization of people working together towards a common goal. Sometimes these goals take a few months and sometimes they can take years. By supporting a collective with a recurring monthly amount, you help the collective plan out its future activities.</p>
          
          <h3 id="charge-date-notice">Why do you charge recurring monthly subscriptions on 1st of every month?</h3>
          <p>It helps our collectives manage their monthly budget. Instead of getting donations randomly throughout the month, they can start a month with a minimum budget for that month. Any new donations during the month only improves their budget.</p>

          <p>We would also like to eventually move to charging a single payment for multiple monthly donations from the same user. Fewer transactions means less fees going towards payment processors and more for collectives. Stay tuned for updates on that in the near future.</p> 
          
          <h3>How can I cancel my monthly donation?</h3>
          <p>We are sorry to see you go! Go to <a href="https://opencollective.com/subscriptions">opencollective.com/subscriptions</a> to manage your subscriptions.</p>
          
          <h3>Where can I report a Collective? </h3>
          <p>We strive to keep our community healthy, safe and in line with our mission. If you wish to report a collective’s activity please email us report@opencollective.com</p>
          
          <h3>Why is my Collective not able to receive donations yet? </h3>
          <p>We are thrilled you have created your Open Collective! We are still in private beta and we have a selection process to ensure the quality of the collectives our users can back before they are active to receive donations. We are working hard to get everyone aboard!</p>
          
          <h3>What are your Terms of Service and Privacy Policy?</h3>
          <p><a href="https://docs.google.com/document/u/1/d/1HRYVADHN1-4B6wGCxIA6dx28jHtcAVIvt95hkjEZVQE/pub">Terms of Service</a></p>
          <p><a href="https://docs.google.com/document/u/1/d/1OHztLGympxBPVwrLqb8jtCIlDV5Fr6TysOeGXUkDnMM/pub">Privacy Policy</a></p>
          <p>Please read them carefully!</p>    
          
          <h3>Can’t find the answer you are looking for?</h3>
          <p>Shoot us an email at support@opencollective.com or drop by our Slack channel https://slack.opencollective.com</p>
          
          <h3 id="investors">Who are your investors?</h3>
          <details>
            <summary>We raised a total of $805k so far on convertible notes (<a href="https://www.ycombinator.com/docs/SAFE_Cap.rtf">SAFE</a>)</summary>

            <p>We did a first pre-seed round of $500k in October 2015 (SAFE, $5M cap) with:
              <ul>
                <li><span>$250k</span> <a href="http://generalcatalyst.com">General Catalyst</a> (SF/NYC/Boston, <a href="https://www.linkedin.com/in/hemanttaneja">Hemant Taneja</a>)</li>
                <li><span>$50k</span> <a href="https://www.linkedin.com/in/jsiegel">Jonathan Siegel</a> (can't pin down his location)</li>
                <li><span>$50k</span> <a href="http://belcube.com">Belcube</a> (Brussels)</li>
                <li><span>$50k</span> <a href="https://www.linkedin.com/in/teljamou">Tony Jamous</a> (London, <a href="https://nexmo.com">Nexmo</a>)</li>
                <li><span>$25k</span> <a href="https://uk.linkedin.com/in/enadalin">Eric Nadalin</a> (London, <a href="https://nexmo.com">Nexmo</a>)</li>
                <li><span>$25k</span> <a href="https://www.linkedin.com/in/brian-larson-43904010">Brian Larson</a> (SF, engineer at Google, Twitter)</li>
                <li><span>$15k</span> <a href="https://twitter.com/rauchg">Guillermo Rauch</a> (SF/Buenos Aires, <a href="http://socket.io">socket.io</a>)</li>
                <li><span>$10k</span> <a href="http://buytaert.net">Dries Buytaert</a> (Boston, <a href="https://drupal.org">Drupal</a>)</li>
                <li><span>$10k</span> <a href="http://underscore.vc">Underscore.vc</a> (Boston)</li>
                <li><span>$5k</span> <a href="https://www.linkedin.com/in/toonvanagt">Toon Vanagt</a> (Brussels, <a href="http://data.be">data.be</a>)</li>
                <li><span>$5k</span> <a href="https://www.linkedin.com/in/xaviercorman">Xavier Corman</a> (Brussels, <a href="http://edebex.com">Edebex</a>)</li>
                <li><span>$5k</span> Personal friend</li>
              </ul>
            </p>

            <p>We did a follow up round of $315k in July 2016 (SAFE, $8M cap) with:
              <ul>
                <li><span>$100k</span> <a href="https://www.linkedin.com/in/ricardo-gorodisch-9b057889">Ricardo Gorodisch</a> (Argentina, President <a href="http://www.fundacionkaleidos.org/">Foundation Kaleidos</a>)</li>
                <li><span>$50k</span> <a href="https://www.linkedin.com/in/petekoomen">Pete Koomen</a> (SF, Cofounder/CTO <a href="http://optimizely.com">Optimizely</a>)</li>
                <li><span>$25k</span> <a href="https://www.linkedin.com/in/jpayne">Jim Payne</a> (NYC, Cofounder MoPub, EIR Accel Partners)</li>
                <li><span>$25k</span> <a href="https://www.linkedin.com/in/caesar-sengupta-2743b">Caesar Sengupta</a> (Bay Area, VP Product Management at Google)</li>
                <li><span>$20k</span> <a href="https://www.linkedin.com/in/gkgandhi">Gautam Gandhi</a> (India, Entrepreneur, former Head New Business Development India at Google)</li>
                <li><span>$15k</span> <a href="https://www.linkedin.com/in/tpbrown5">Tom Brown</a> (FinTech lawyer, partner at Paul Hastings, former VP at Visa )</li>
                <li><span>$15k</span> <a href="https://www.linkedin.com/in/sam-de-brouwer-b0a34122">Sam De Brouwer</a> (SF, <a href="http://www.tedxsanfrancisco.com">TEDxSanFrancisco</a>)</li>
                <li><span>$15k</span> Vadim (NYC/Bay Area/Buenos Aires)</li>
                <li><span>$10k</span> <a href="https://www.linkedin.com/in/johnkobs">John Kobs</a> (SF, Entrepreneur/CEO at <a href="http://ApartmentList.com">ApartmentList</a>)</li>
                <li><span>$10k</span> <a href="https://www.linkedin.com/in/nicolaswittenborn">Nicolas Wittenborn</a> (Berlin, principal at point 9 venture)</li>
                <li><span>$10k</span> <a href="https://www.linkedin.com/in/derek-parham-b7b5504">Derek Parham</a> (NYC, deputy CTO at Hillary For America)</li>
                <li><span>$10k</span> <a href="https://www.linkedin.com/in/hbridge">Henry Bridge</a> (NYC, Director of Product at Hillary For America)</li>
                <li><span>$10k</span> <a href="https://www.linkedin.com/in/antoineperdaens">Antoine Perdaens</a> (Belgium, Cofounder/CEO at <a href="http://knowledgeplaza.net">KnowledgePlaza</a>)</li>
              </ul>
            </p>
          </details>

          <h3 id="wdydwyd">Why Do You Do What You Do? <a href="https://twitter.com/search?f=images&vertical=default&q=%23wdydwyd&src=typd" target="_blank">#wdydwyd</a></h3>
          <p>We want to empower people to create the organizations and institutions of tomorrow, one community at a time.</p>

          <details>
            <summary>
              "I want to empower people to go build the organizations, movements, associations and institutions of tomorrow in a bottom-up fashion where transparency is built in by design."
              – <a href="https://twitter.com/xdamman">Xavier</a>, cofounder
            </summary>
              <p>After <a href="https://Storify.com">Storify</a> (my first startup in Silicon Valley), one of my options was to go back to Belgium (where I’m originally from) and start a new political party or a “union 2.0”. Why? Because 90%+ of the young people there don’t feel represented by those institutions (and I’m pretty sure it’s the same in your country). They were founded 100+ years ago (BI -- Before Internet) at a time when paper was the only communication channel readily available. They lack feedback loops, they lack transparency and as a result, they are increasingly disconnected from reality. We need new institutions for this Internet era.</p>

              <p>I could spend the next 5-10 years of my life doing that. But that doesn't scale. Yet, this is a global issue. It's not limited to Belgium. So I wondered: “How can I empower others to go build those institutions of tomorrow?”; “What tools do people need to create those organizations?”.</p>

              <p>While the Internet has been really good so far at helping people get together and do things together, it has been quite bad at dealing with money. As a result, we’ve seen a lot of movements popping up here and there that ended up disappearing as quickly. The harsh reality of this world is that without money, you can’t sustain a community over time.</p>

              <p>The biggest notable exception is <a href="https://en.wikipedia.org/wiki/Podemos_%28Spanish_political_party%29#cite_note-GPnov2014-54">Podemos</a>, the new political party in Spain that started in 2014 and who quickly became the second largest political party just a year later. Their secret? They were able to get 285,000+ people to become members and pay a minimum of 5 euros (~$6) per month to finance and sustain the movement.</p>

              <p>Unfortunately, it’s still too complicated for a community to quickly collect money for their cause.</p>

              <p>I experienced it first hand when I lead the <a href="http://startupmanifesto.be">Startup Manifesto in Belgium</a>. A grassroots movement to come up with recommendations to the government to “make it suck less” for startups in Belgium. At some point, we wanted to print stickers for a conference but we didn’t have money. Plenty of people were willing to support our cause and make a donation. But in order to accept that money, we would have to create a bank account, which requires first to create a legal entity. We had better things to do. Not to mention that the money would have been collected in a black box where all supporters would have zero visibility. That was against our values. So we just gave up on the idea of collecting money. And <a href="https://twitter.com/xdamman/status/575744358592475136">an existing organization simply paid the stickers for us</a>.</p>

              <p>That’s why I’m building Open Collective.</p>
            </details>
        </div>
        <PublicFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(Faq);

function mapStateToProps() {
  return {
    i18n: i18n('en')
  }
}
