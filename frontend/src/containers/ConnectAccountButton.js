import React from 'react';
import { connect } from 'react-redux';
import connectAccount from '../actions/connectedAccounts/connect_account';

const mapDispatchToProps = { connectAccount };

export default connect(null, mapDispatchToProps)(({ params, connectAccount }) => (
  <button class="connectAccountBtn" onClick={() => connectAccount(params.service)}>
    Connect to {params.service}
  </button>
));
