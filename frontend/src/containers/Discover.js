import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import DiscoverSelect from '../components/discover/DiscoverSelect';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';
import CollectiveCard from '../components/CollectiveCard';

import fetchDiscover from '../actions/discover/fetch';

export class Discover extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentShowOption: null,
      currentSortOption: null
    };
  }

  componentDidMount() {
    const { fetchDiscover } = this.props;
    fetchDiscover();
  }

  render() {
    const { i18n, discover } = this.props;
    const { currentShowOption, currentSortOption } = this.state;
    const showOptions = ['Open Source', 'Meetup'];
    const sortOptions = ['Newest'];
    const collectives = discover.collectives ? discover.collectives : [];

    if (!currentShowOption && showOptions.length) {
      this.setState({currentShowOption: showOptions[0]});
    }

    if (!currentSortOption && sortOptions.length) {
      this.setState({currentSortOption: sortOptions[0]});
    }

    return (
      <div className='Discover'>
          <LoginTopBar />
          <div className='Discover-container'>
            <div className='Discover-hero'>
              <div className='Discover-hero-cover'>
                <div className='Discover-hero-line1'>Discover awesome collectives to support</div>
                <div className='Discover-hero-line2'>Let's make great things together.</div>
                <div className='Discover-hero-actions'>
                  <DiscoverSelect label='Show' options={ showOptions } currentOption={ currentShowOption || '' } onSelect={option => this.setState({currentShowOption: option})} />
                  <DiscoverSelect label='Sort by' options={ sortOptions } currentOption={ currentSortOption } onSelect={option => this.setState({currentSortOption: option})} />
                </div>
              </div>
            </div>
            <div className='Discover-results'>
              {collectives.map(collective => <CollectiveCard i18n={i18n} {...collective}/>)}
            </div>
          </div>
          <PublicFooter />
      </div>
    )
  }
}


export default connect(mapStateToProps, {
  fetchDiscover
})(Discover);

function mapStateToProps({ discover }) {
  return {
    discover,
    i18n: i18n('en')
  }
}
