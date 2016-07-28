import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';

export class Discover extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchHome, loadData} = this.props;

    if (loadData) {
      fetchHome();
    }
  }

  render() {
  	return (
  		<div className='Discover'>
	        <LoginTopBar />
	        <div className='Discover-container'>
	        	<div className='Discover-hero'>
	        		<div className='Discover-hero-cover'>
	        			<div className='Discover-hero-line1'>Discover awesome collectives to support</div>
	        			<div className='Discover-hero-line2'>Let's make great things together.</div>
	        			<div className='Discover-hero-actions'>
	        			</div>
	        		</div>
	        	</div>
        		<div className='Discover-results'>
        			Discover-results
        		</div>
	        </div>
	        <PublicFooter />
  		</div>
  	)
  }
}


export default connect(mapStateToProps, {})(Discover);

function mapStateToProps() {
  return {
    i18n: i18n('en')
  }
}
