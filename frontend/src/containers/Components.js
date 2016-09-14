import React, { Component } from 'react';
import { connect } from 'react-redux';

export class Components extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='Components'>
        Components
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(Components);

function mapStateToProps() {
  return {};
}
