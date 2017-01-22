import React, { Component, PropTypes } from 'react';

import CollectiveList from '../CollectiveList';

export default class CollectivePostDonationThanks extends Component {

  constructor(props) {
    super(props);
    const { collective } = this.props;
    const mention = collective.twitterHandle ? `@${collective.twitterHandle}` : collective.name;
    const tweet = this.props.tweet || `🎉 I'm now a proud supporter of ${mention}. You should support them too! https://opencollective.com/${collective.slug} #opencollective`;
    this.state = { tweet };
  }

  render() {
    const { collective, i18n, closeDonationFlow, showRelated } = this.props;

    return (
      <div className='CollectiveThanks'>
        <div className='center pt3'>
          <svg className='CollectiveThanks-icon' width='160' height='116'>
            <use xlinkHref={collective.currency === 'EUR' ? '#svg-icon-donation-done-euro' : '#svg-icon-donation-done'} />
          </svg>
          <h2 className='CollectiveSignup-title pt2 m0 -ff-sec -fw-bold'>{i18n.getString('thankyou')}</h2>
          <div className='Collective-font-17 pb3 -ff-sec -fw-light'>
            { i18n.getString('nowOnBackersWall') }
          </div>
          <div className="tweet">
            <textarea name="tweetText" onChange={this.handleChange} name="textToShare" value={this.state.tweet} />
            <button onClick={::this.tweet} className='px3 -btn -green -btn-outline -btn-small -ttu -ff-sec -fw-bold'>Tweet this!</button>
          </div>
          <div className='Collective-font-13 max-width-2 pt2 pb2 center -ff-sec -fw-light '>
            { i18n.getString('chargeDateNotice') } <a href='https://opencollective.com/faq#charge-date-notice'>Why?</a>
          </div>
        </div>
        { showRelated &&
          <section className='pt2 center'>
            <CollectiveList style="small" title={i18n.getString('checkOutOtherSimilarCollectives')} groupList={collective.related} {...this.props} />
          </section>
        }
        <div className="CollectiveThanks center pt3" onClick={ closeDonationFlow }>
          <a href='#'> Return to the {collective.name} collective</a>
        </div>
      </div>
    );
  }

  tweet() {
    const shareUrl = `https://twitter.com/intent/tweet?status=${this.state.tweet}`
    const w = 650;
    const h = 450;
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);

    window.open(shareUrl, 'ShareWindow', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`);

    this.props.closeDonationFlow();
  }

  handleChange(event) {
    this.setState({tweet: event.target.value});
  }
}

CollectivePostDonationThanks.propTypes = {
  closeDonationFlow: PropTypes.func.isRequired,
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  showRelated: PropTypes.bool,
  tweet: PropTypes.string,
}

CollectivePostDonationThanks.defaultProps = {
  showRelated: true
};