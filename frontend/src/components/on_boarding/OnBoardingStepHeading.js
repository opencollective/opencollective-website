import React from 'react';

export default class OnBoardingStepHeading extends React.Component {

  constructor(props) {
    super(props);
  }
  
  render() {
    const { step, title, subtitle } = this.props;
    return (
      <div className='OnBoardingStepHeading'>
        <div>
          <strong>{step}</strong>&nbsp;<span>{title}</span>
        </div>
        {subtitle && <div>{subtitle.split('\\n').map((line, i) => <span key={i}>{line}<br/></span>)}</div>}
      </div>
    )
  }
}
