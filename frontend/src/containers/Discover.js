import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import DiscoverSelect from '../components/discover/DiscoverSelect';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';
import CollectiveCard from '../components/CollectiveCard';

export class Discover extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentShowOption: null,
      currentSortOption: null
    };
  }

  componentDidMount() {
    const { fetchHome, loadData} = this.props;

    if (loadData) {
      fetchHome();
    }
  }

  render() {
    const { i18n } = this.props;
    const { currentShowOption, currentSortOption } = this.state;
    const showOptions = ['Open Source', 'Meetup'];
    const sortOptions = ['Newest'];
    const results = [1,2,4,5,6,7];
    
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
              {results.map(collective => <CollectiveCard i18n={i18n} />)}
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
