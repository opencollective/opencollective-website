import React from 'react';

export default class PublicGroupThanksV2 extends React.Component {
  componentDidMount() {
    document.body.style.overflow = 'hidden';
  }

  close() {
    document.body.style.overflow = '';
    this.props.closeDonationModal();
  }

  render() {
    const { message } = this.props;

    return (
      <div className='PublicGroupThanksV2 center pt3'>
        <svg className='PublicGroupThanksV2-icon' width='160' height='116'>
          <use xlinkHref='#svg-icon-donation-done' />
        </svg>
        <h2 className='PublicGroupSignupV2-title pt2 m0 -ff-sec -fw-bold'>Great!</h2>
        <div className='PublicGroup-font-17 pb3 -ff-sec -fw-light'>
          {message || "Thank you for your support"}
        </div>
        <button onClick={::this.close} className='px3 -btn -green -btn-outline -btn-small -ttu -ff-sec -fw-bold'>Done</button>
      </div>
    );
  }
};
