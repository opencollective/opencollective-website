import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import resetNotifications from '../actions/notification/reset';
import Icon from '../components/Icon';

class Notification extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { notification, autoclose, autocloseTimeout=5000 } = this.props;
    const status = notification.status || 'hide';

    if (autoclose && status !== 'hide') {
      setTimeout(() => {
        this.props.resetNotifications();
      }, autocloseTimeout);
    }

    return (
      <div className={`Notification Notification--${status}`}>
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

  componentDidMount() {
    this.props.resetNotifications();
  }
};

Notification.propTypes = {
  resetNotifications: PropTypes.func.isRequired,
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
