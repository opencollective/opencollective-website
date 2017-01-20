import React, { Component, PropTypes } from 'react';
import Tiers from '../../components/Tiers';

export default class CollectiveDonate extends Component {

  render() {
    const { collective, host, i18n, onToken, donationForm, appendDonationForm } = this.props;

    if (!collective.tiers || !host) return (<div />);

    return (
      <section id='donate'>
        <div id='support'></div>
        <div className='CollectiveDonate-container center'>
          <h1>{i18n.getString('joinAndFulfil')}</h1>
          <h2 className="subtitle">{i18n.getString('helpUsContinueOurActivities')}</h2>
          <Tiers
            tiers={collective.tiers}
            collective={collective}
            host={host}
            i18n={i18n}
            donationForm={donationForm}
            appendDonationForm={appendDonationForm}
            onToken={onToken}
          />
        </div>
      </section>
    );
  }
}

CollectiveDonate.propTypes = {
  collective: PropTypes.object.isRequired,
  host: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  donationForm: PropTypes.object.isRequired,
  appendDonationForm: PropTypes.func.isRequired,
  onToken: PropTypes.object.isRequired
}