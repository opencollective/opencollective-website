import React, { Component } from 'react';
import { connect } from 'react-redux';

import PublicGroup from './PublicGroup';

export class App extends Component {
  render() {
    return (
      <div className='App'>
        <PublicGroup />
      </div>
    );
  }
}

export default connect(mapStateToProps , {})(App);

export function mapStateToProps() {
  return {};
}
