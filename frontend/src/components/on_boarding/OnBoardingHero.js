import React from 'react';

export default class OnBoardingHero extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { onClickStart } = this.props;
    return (
      <div className='OnBoardingHero'>
        <div className='-title'>
          Apply to create an open collective for your <strong>open source</strong> project.
        </div>
        <div className='-subtitle'>
          We are starting to accept new open collectives. Reserve your spot today.
        </div>
        <div className='-button-container'>
          <div className='OnBoardingButton' onClick={onClickStart}>Let's do this</div>
        </div>
        <div className="-requirements">
          You'll need a GitHub account, a repository with over 100 stars that you own & at least 2 contributors.
        </div>
      </div>
    )
  }
}
