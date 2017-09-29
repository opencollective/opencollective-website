import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

// Taken from https://github.com/joshgeller/react-redux-jwt-auth-example/blob/master/src/components/AuthenticatedComponent.js
export function requireAuthentication(Component) {

  class AuthenticatedComponent extends React.Component {

    componentWillMount() {
      this.checkAuth(this.props.isAuthenticated);
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth(nextProps.isAuthenticated);
    }

    checkAuth(isAuthenticated) {
      if (!isAuthenticated) {
        const redirectAfterLogin = this.props.location.pathname;
        this.props
        .dispatch(pushState(null, `/signin?next=${redirectAfterLogin}`));
      }
    }

    render() {
      if (this.props.isAuthenticated) {
        return <Component {...this.props}/>;
      }

      return null;
    }
  }

  const mapStateToProps = ({session}) => ({
    isAuthenticated: session.isAuthenticated
  });

  return connect(mapStateToProps)(AuthenticatedComponent);

}