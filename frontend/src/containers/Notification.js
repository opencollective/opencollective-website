import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import resetNotifications from '../actions/notification/reset';
import Icon from '../components/Icon';

class Notification extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { notification } = this.props;
    const status = notification.status || 'hide';

    return (
      <div className={`Notification Notification--${status}`} onClick={() => this.props.resetNotifications()}>
        {this.icon(status)}
        {notification.message}
      </div>
    );
  }

  icon(status) {
    const type = {
      error: 'rejected',
      success: 'approved',
      info: 'pending',
      warning: 'pending'
    };

    return <Icon type={type[status]} />;
  }

  componentWillMount() {
    this.props.resetNotifications();
  }

  componentDidMount() {
    this.setTimerToResetNotifications();
  }

  componentDidUpdate() {
    this.setTimerToResetNotifications();
  }

  setTimerToResetNotifications() {
    if (this.props.notification.status && this.props.notification.status !== 'hide') {
      const autocloseTimeout = this.props.autocloseTimeout || 5000;
      setTimeout(() => {
        this.props.resetNotifications();
      }, autocloseTimeout);
    }
  }
}

Notification.propTypes = {
  resetNotifications: PropTypes.func.isRequired,
  autocloseTimeout: PropTypes.number,
  notification: PropTypes.shape({
    status: PropTypes.string,
    message: PropTypes.string
  })
};


export default connect(mapStateToProps, {
  resetNotifications
})(Notification);

export function mapStateToProps({ notification }) {
  return { notification };
}
