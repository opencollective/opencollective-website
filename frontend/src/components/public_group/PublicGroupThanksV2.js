import React from 'react';

export default class PublicGroupThanksV2 extends React.Component {

  constructor(props) {
    super(props);
    const { group } = this.props;
    const mention = group.twitterHandle ? `@${group.twitterHandle}` : group.name;
    const tweet = this.props.tweet || `🎉 I'm now a proud supporter of ${mention}. You should support them too! https://opencollective.com/${group.slug} #opencollective`;
    this.state = { tweet };
  }

  tweet() {

    const shareUrl = `https://twitter.com/intent/tweet?status=${this.state.tweet}`

    const w = 650;
    const h = 450;

    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);

    window.open(shareUrl, 'ShareWindow', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`);

    this.props.closeDonationModal();
  }

  handleChange(event) {
    this.setState({tweet: event.target.value});
  }

  render() {
    const { group, message, i18n } = this.props;

    return (
      <div className='PublicGroupThanksV2 center pt3'>
        <svg className='PublicGroupThanksV2-icon' width='160' height='116'>
          <use xlinkHref={group.currency === 'EUR' ? '#svg-icon-donation-done-euro' : '#svg-icon-donation-done'} />
        </svg>
        <h2 className='PublicGroupSignupV2-title pt2 m0 -ff-sec -fw-bold'>{message || i18n.getString('thankyou')}</h2>
        <div className="tweet">
          <textarea name="tweetText" onChange={this.handleChange} name="textToShare" value={this.state.tweet} />
          <button onClick={::this.tweet} className='px3 -btn -green -btn-outline -btn-small -ttu -ff-sec -fw-bold'>Tweet this!</button>
        </div>
      </div>
    );
  }
}
