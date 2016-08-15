import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import PublicGroupHero from '../components/public_group/PublicGroupHero';

export default class EditCollective extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='EditCollective'>
        <div className='EditCollective-TopBar'></div>
        <div className='-hspacer'></div>
        <div className='flex'>
          <div className='flex-auto'>
            <div className='flex'>
              <div className='-vspacer'></div>
              <div className='EditCollective-viewport flex-auto'>
                <PublicGroupHero group={{tiers:[]}} {...this.props} />
              </div>
            </div>
          </div>
          <div className='-vspacer'></div>
        </div>
        <div className='-hspacer'></div>
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(EditCollective);
export function mapStateToProps({}){
  return {
    i18n: i18n('en')
  };
}
