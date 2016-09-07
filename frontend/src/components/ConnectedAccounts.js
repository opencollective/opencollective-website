import React from 'react';
import { connect } from 'react-redux';
import fetchConnectedAccounts from '../actions/connected-accounts/fetch_by_slug';

class ConnectedAccounts extends React.Component {
  componentDidMount() {
    this.props.fetchConnectedAccounts(this.props.params.slug);
  }

  render() {
    const { connectedAccounts } = this.props;
    return (
      <div>
        <h>{connectedAccounts.length} accounts connected to {this.props.params.slug}</h>
        {connectedAccounts.length > 0 && connectedAccounts.map(ca => <div>
          id: {ca.id}, provider: {ca.provider}, username: {ca.username}
        </div>)}
      </div>
    );
  }
}

const mapStateToProps = ({connectedAccounts}) => ({connectedAccounts});
const mapDispatchToProps = {fetchConnectedAccounts};
export default connect(mapStateToProps, mapDispatchToProps)(ConnectedAccounts);
