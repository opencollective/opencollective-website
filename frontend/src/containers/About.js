import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';
import MailChimpInputSection from '../components/homepage/MailChimpInputSection';

export class About extends Component {

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
      <div className='About Page'>
        <LoginTopBar />
        <div className='Page-container'>
          <h2>About</h2>
          <p>While the Internet has been very good so far at helping people do things together, it is still very difficult for groups to collect money and use it transparently. As a result, we see initiatives, projects, movements popping up here and there that disappear quickly from lack of funding. Imagine how many wonderful things don’t happen in the world because funding - which is oxygen for most organizations - is difficult to sustain. Without an easy way to raise and spend money, it’s hard to manage and grow many of these seeds of an idea that could change the world.</p>

          <p>Meetups, open source projects, parent associations, neighborhood associations, pet projects, clubs, unions, movements, non-profits, business incubators - in order to operate, all of them are forced to use a physical glass jar, ask a sponsor to directly pay their expenses or front the huge overhead of setting up and managing a corporation or a non-profit. It’s either inefficient and opaque or it’s overkill.</p>

          <p>OpenCollective enables groups to quickly set up a collective, raise funds and manage them transparently.</p> 

          <p>We want all those seeds to have a chance to grow, to bring their ideas to life. We believe everyone should have the tools to create the organizations of tomorrow. And we are dedicating ourselves to making that happen!</p>

          <p><b>Contact us:</b> <a href='mailto:info@opencollective.com?subject=Hello'>info@opencollective.com</a></p>
          
          <p><b>Read more:</b> <a href='//medium.com/open-collective'>our blog</a> or with our essays:
            <ul>
              <li><a href='//medium.com/open-collective/a-new-form-of-association-for-the-internet-generation-part-1-6d6c4f5dd27f#.i2x2jjp79' target='_blank'>A New Form of Association For the Internet Generation - Part 1</a></li>
              <li><a href='//medium.com/open-collective/a-new-form-of-association-for-the-internet-generation-part-2-fe6d8415f444#.j41n366wg' target='_blank'>A New Form of Association For the Internet Generation - Part 2</a></li>
            </ul>
          </p>

          <p>
            Download the <a href='/public/images/opencollectivelogo.png'>Open Collective Logo</a> in high resolution: <a href='/public/images/opencollectivelogo.svg'>svg</a> - <a href='/public/images/opencollectivelogo.png'>png</a>
            <br />      
            <a href='//opencollective.com/public/images/opencollectivelogo.svg'>
              <img src='//opencollective.com/public/images/opencollectivelogo.svg' style={{marginTop: '40px'}} />
            </a>
          </p>
        </div>

        <div className='About-container no-bg'>
          <h2 className='center'>Our Founding Team</h2>
          <div className='clearfix'>
            <div className='col col-12 sm-col-12 md-col-6 lg-col-4'>
              <div className='team-member'>
                  <img src='//opencollective.com/public/images/xavier.jpg' height='200px' width='200px' alt='Xavier Damman' />
                  <h4>Xavier Damman</h4>
                  <p>Founder/CEO</p>
                  <ul>
                      <li>
                        <a href='//twitter.com/xdamman'>
                          <i className='fa-twitter'></i>
                        </a>
                      </li>
                      <li>
                        <a href='//facebook.com/xdamman'>
                          <i className='fa-facebook'></i>
                        </a>
                      </li>
                      <li>
                        <a href='//linkedin.com/in/xavierdamman'>
                          <i className='fa-linkedin'></i>
                        </a>
                      </li>
                  </ul>
              </div>
            </div>
            <div className='col col-12 sm-col-12 md-col-6 lg-col-4'>
              <div className='team-member'>
                  <img src='//opencollective.com/public/images/pia.jpg' height='200px' width='200px' alt='Pia Mancini' />
                  <h4>Pia Mancini</h4>
                  <p>Cofounder</p>
                  <ul>
                      <li>
                        <a href='//twitter.com/piamancini'>
                          <i className='fa-twitter'></i>
                        </a>
                      </li>
                      <li>
                        <a href='//facebook.com/pmancini'>
                          <i className='fa-facebook'></i>
                        </a>
                      </li>
                      <li>
                        <a href='//linkedin.com/in/piamancini'>
                          <i className='fa-linkedin'></i>
                        </a>
                      </li>
                  </ul>
              </div>
            </div>
            <div className='col col-12 sm-col-12 md-col-6 lg-col-4'>
              <div className='team-member'>
                <img src='//opencollective.com/public/images/aseem.jpg' height='200px' width='200px' alt='Aseem Sood' />
                <h4>Aseem Sood</h4>
                <p>Cofounder</p>
                <ul>
                    <li>
                      <a href='//twitter.com/AseemSood_'>
                        <i className='fa-twitter'></i>
                      </a>
                    </li>
                    <li>
                      <a href='//facebook.com/aseem.sood'>
                        <i className='fa-facebook'></i>
                      </a>
                    </li>
                    <li>
                      <a href='//linkedin.com/in/aseems'>
                        <i className='fa-linkedin'></i>
                      </a>
                    </li>
                </ul>
              </div>
            </div>
          </div>
          <p class="large text-muted">We are passionate about how we can use technology to empower people to do more. So far, the Internet has been pretty good at helping people get together and do amazing things together. But once there is money involved, it is still a huge pain. It doesn't have to be that way.</p>
        </div>
        
        <div className='About-container no-bg'>
          <div className='center'>
            <h1 class="section-heading">Stay posted</h1>
            <p>Stay posted on our news and progress.</p>
          </div>  
          <MailChimpInputSection mcListId="14d6233180" />

          <h4 className='center'>Stay in touch or get in touch!</h4>

          <div className='links center'>
            <ul className='social-list'>
                <li><a href='//twitter.com/opencollect'><i className='fa-twitter'></i></a></li>
                <li><a href='mailto:info@opencollective.com'><i className='fa-envelope-o'></i></a></li>
                <li><a href='//medium.com/open-collective'><i className='fa-medium'></i></a></li>
                <li><a href='//slack.opencollective.com/'><i className='fa-slack'></i></a></li>
                <li><a href='//github.com/OpenCollective/OpenCollective'><i className='fa-github'></i></a></li>
            </ul>
            <a href='https://medium.com/open-collective'>Blog</a>
            <a href='https://github.com/OpenCollective/OpenCollective'>Open&nbsp;Source</a>
            <a href='https://github.com/OpenCollective/OpenCollective/blob/master/COMMUNITY-GUIDELINES.MD'>Community&nbsp;Guidelines</a>
          </div>
        </div>
        <PublicFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(About);

function mapStateToProps() {
  return {};
}
