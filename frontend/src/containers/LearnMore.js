import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';
import Grid, { Column } from '../components/Grid';

export class LearnMore extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='LearnMore'>
          <LoginTopBar />
          <div className='LearnMore-container'>
            <section className='LearnMore-Section1'>
              <div className='LearnMoreHeader'>Discover a new form of association</div>
              <div className='LearnMoreHeader -faded'>Transparent by design</div>
              <div className='-img'></div>
            </section>
            <section className='LearnMore-Section2'>
              <div className='LearnMoreHeader'>Open your finances to your community</div>
              <Grid className='Wrap900'>
                <Column span='6'>
                  <div className='LearnMoreLead'>Unpaid Expenses</div>
                  <div className='LearnMoreSubLead'>All submitted expenses can be seen by everyone. Core members of a collective can approve or reject them.</div>
                  <div className='-img-1'></div>
                </Column>
                <Column span='6'>
                  <div className='LearnMoreLead'>Funds Available</div>
                  <div className='LearnMoreSubLead'>Your available funds are visible to everyone. Anyone can see the money that went in &amp; out of the collective.</div>
                  <div className='-img-2'></div>
                </Column>
              </Grid>
              <div className='-img'></div>
            </section>
            <section className='LearnMore-Section3'>
              <Grid className='Wrap900'>
                <Column span='7'>
                  <div className='LearnMoreHeader'>Submit Expenses</div>
                  <div className='LearnMoreText'>Take a picture of the receipt with your phone or upload a PDF to the collective.</div>
                </Column>
                <Column span='5'>
                  <div className='-img'></div>
                </Column>
              </Grid>
            </section>
            <section className='LearnMore-Section4'>
              <Grid className='Wrap1000'>
                <Column span='6'>
                  <div className='LearnMoreHeader'>Approve & Reimburse <span className='-faded'>(or&nbsp;Reject)</span></div>
                  <div className='LearnMoreText'>Give permission to the organizers of your collective to approve expenses. Once approved, the Host can reimburse the expenses in one click. (using&nbsp;PayPal&nbsp;or&nbsp;manually).</div>
                </Column>
                <Column span='6'>
                  <div className='-img'></div>
                </Column>
              </Grid>
            </section>
            <section className='LearnMore-Section5'>
              <div className='Wrap1000'>
                <div className='LearnMoreHeader'>Request Money</div>
                <div className='LearnMoreText'>
                  Easily create and share a URL to raise funds for specific activities or goals in your collective.<br/>
                  <span className='-faded'>Many currencies are supported</span> 😉
                </div>
                <div className='-img'></div>
              </div>
            </section>
            <section className='LearnMore-Section6'>
              <div className='Wrap1000'>
                <div className='LearnMoreHeader'>Different efforts, Different Tiers.</div>
                <div className='LearnMoreText -faded'>Create the tiers that suit your collective.</div>
              </div>
              <Grid className='Wrap1000'>
                <Column span='6'>
                  <div className='-img'>
                    <div className='-img2'></div>
                  </div>
                </Column>
                <Column span='6'>
                  <div className='-img -sponsor'>
                    <div className='-img2'></div>
                  </div>
                </Column>
              </Grid>
            </section>
            <section className='LearnMore-Section7'>
              <Grid className='Wrap1000'>
                <Column span='7'>
                  <div className='LearnMoreHeader'>Automatically generate a PDF invoice for each donation</div>
                  <div className='LearnMoreText'>You can customize the information displayed</div>
                </Column>
                <Column span='5'>
                  <div className='-img'></div>
                </Column>
              </Grid>
            </section>
            <section className='LearnMore-Section8'>
              <div className='Wrap1000'>
                <div className='LearnMoreHeader'>Show your backers</div>
                <div className='LearnMoreText'>Highlight those who support your mission and earn the trust of new comers</div>
              </div>
              <div className='-img'></div>
              <div className='Wrap1000'>
                <div className='-info'>backers via: webpack</div>
              </div>
            </section>
            <section className='LearnMore-Section9'>
              <div className='Wrap520'>
                <div className='LearnMoreHeader'>You own your data.</div>
                <div className='LearnMoreText'>Export all your backers with their email address at any time.</div>
                <div className='-img'></div>
              </div>
            </section>
            <section className='LearnMore-SectionA'>
              <div className='Wrap520'>
                <div className='LearnMoreHeader'>Open At Heart</div>
                <div className='LearnMoreText'>Our software is open source. <a href='//github.com/opencollective'>Visit our github</a></div>
                <div className='-img'></div>
              </div>
            </section>
            <section className='LearnMore-SectionB'>
              <div className='Wrap520'>
                <div className='LearnMoreHeader'>Join the movement</div>
                <div className='LearnMoreText'>Support the new generation of associations</div>
                <div>
                  <a className='Button Button--green' href='/opensource/apply'>Start A Collective</a>
                  <a className='Button Button--green' href='/discover'>Discover&nbsp;Collective</a>
                </div>
              </div>
            </section>
          </div>
          <PublicFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(LearnMore);

function mapStateToProps() {
  return {}
}
