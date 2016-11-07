import React from 'react';
import AmountPicker from '../../components/public_group/AmountPicker';

export default class CollectiveDonate extends React.Component {
  _showTier(tier, index) {
    const { onDonate, i18n, collective } = this.props;
    const description = tier.description || i18n.getString(`${tier.name}Description`);

    return (
      <div className='px3 pb4 mb4 border-box flex' key={`${tier.name}_${index}`}>
        <div className='CollectiveDonate-tier-box-inner -border-green border mt3 relative col-12'>
          <h3 className='CollectiveDonate-tier-box-title h3 mt0'>
            <span className='bg-light-gray px2 -fw-ultra-bold'>{i18n.getString('becomeA')} {tier.name}</span>
          </h3>
          <p className='CollectiveDonate-tier-box-description h5 mt0 mb3 px3 flex justify-center items-center'>
            {description}
          </p>
          <AmountPicker tier={tier} onToken={onDonate.bind(this)} group={ collective } {...this.props}/>
        </div>
      </div>
    );
  }

  render() {
    const { collective, i18n } = this.props;

    if (!collective.tiers) return (<div />);

    return (
      <section id='join-us'>
        <div id='support'></div>
        <div className='CollectiveDonate-container px2 container center'>
          <h2 className='Collective-title m0 pb2 -ff-sec -fw-bold'>{i18n.getString('joinAndFulfil')}</h2>
          <p className='Collective-font-17 m0 pb2 px2'>{i18n.getString('helpUsContinueOurActivities')}</p>
          <div className='justify-center clearfix max-width-4 mx-auto pt3'>
            {collective.tiers.map(::this._showTier)}
          </div>
        </div>
      </section>
    );
  }
}
