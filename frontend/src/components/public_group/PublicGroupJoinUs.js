import React from 'react';
import AmountPicker from '../../components/public_group/AmountPicker';

export default class PublicGroupJoinUs extends React.Component {
  _showTier(tier) {
    const { donateToGroup } = this.props;

    return (
      <div className='md-col-6 col-12 px3 pb4 mb4 border-box col'>
        <div className='-border-green border mt3' style={{borderWidth: 2, borderRadius: 6}}>
          <h3 className='h3 mt0' style={{marginTop: '-1em'}}>
            <span className='bg-light-gray px2 -fw-ultra-bold'>Become a {tier.name}</span>
          </h3>
          <p className='h5 mt0 mb3 px3'>{tier.description}</p>
          <AmountPicker tier={tier} onToken={donateToGroup.bind(this)} {...this.props}/>
        </div>
      </div>
    );
  }

  render() {
    const { group } = this.props;

    return (
      <section>
        <div className='PublicGroupJoin-container container center'>
          <h2 className='PublicGroup-title m0 pb2 -ff-sec -fw-bold'>Join us and help fulfill our mission!</h2>
          <p className='PublicGroup-font-17 m0 pb2'>With your membership plan, you’ll help us cover all the expenses the collective needs to keep going!</p>
          <div className='flex flex-wrap justify-center clearfix max-width-4 mx-auto pt3'>
            {group.tiers.map(::this._showTier)}
          </div>
        </div>
      </section>
    );
  }
};
