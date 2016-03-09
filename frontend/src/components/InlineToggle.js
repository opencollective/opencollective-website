import React, { Component } from 'react';

class InlineToggle extends Component {
	constructor(props){
		super(props);
		this.state = {
			showChildren: false
		}
	}
  render() {
  	const {
  		showString,
  		hideString
  	} = this.props
    return (
      <div className='InlineToggle'>
      	<div className='InlineToggle-text' onClick={this.clickHandler.bind(this)}>
      		{this.state.showChildren ? hideString : showString}
      	</div>
        {this.state.showChildren && this.props.children}
      </div>
    );
  }

  clickHandler(){
  	this.setState({showChildren: !this.state.showChildren});
  }
}

export default InlineToggle;