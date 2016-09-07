import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import i18n from '../lib/i18n';

import DiscoverSelect from '../components/discover/DiscoverSelect';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';
import CollectiveCard from '../components/CollectiveCard';

import fetchDiscover from '../actions/discover/fetch';
import fetchGroupTags from '../actions/groups/tags';

export class Discover extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentShowOption: props.params.tag || props.show || 'all',
      currentSortOption: props.sort || 'newest'
    };
    this.onSelectShowOption = this.onSelectShowOption.bind(this);
    this.onSelectSortOption = this.onSelectSortOption.bind(this);
  }

  componentDidMount() {
    const { fetchDiscover, fetchGroupTags } = this.props;
    const { currentShowOption, currentSortOption } = this.state;
    const getScrollTop = () => (window.scrollY || window.pageYOffset || document.body.scrollTop) + (document.documentElement && document.documentElement.scrollTop || 0);
    fetchGroupTags();
    fetchDiscover(currentShowOption, currentSortOption);
    let lastTop = 0xFFFF; // Require scroll towards bottom.
    window.onscroll = debounce(() => {
      const scrollTop = getScrollTop();
      const bottomDirection = lastTop < scrollTop;
      if (bottomDirection && document.documentElement.scrollHeight - (window.innerHeight + scrollTop) < 100) {
        fetchDiscover(this.state.currentShowOption, this.state.currentSortOption, this.props.discover.collectives.length);
      }
      lastTop = scrollTop;
    }, 200);
  }

  render() {
    const { i18n, discover, tags } = this.props;
    const { currentShowOption, currentSortOption } = this.state;
    const showOptions = ['all'];
    const sortOptions = ['newest', 'oldest'];
    const collectives = discover.collectives ? discover.collectives : [];

    if (tags) {
      for (let i = 0, l = tags.length; i < l; i++) {
        showOptions.push(tags[i]);
      }
    }

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
                  <DiscoverSelect label='Show' options={ showOptions } currentOption={ currentShowOption } onSelect={this.onSelectShowOption} />
                  <DiscoverSelect label='Sort by' options={ sortOptions } currentOption={ currentSortOption } onSelect={this.onSelectSortOption} />
                </div>
              </div>
            </div>
            <div className='Discover-results'>
              {collectives.map(collective => <CollectiveCard key={collective.id} i18n={i18n} {...collective} />)}
            </div>
          </div>
          <PublicFooter />
      </div>
    )
  }

  onSelectShowOption(option) {
    const { currentSortOption } = this.state;
    this.discover(option, currentSortOption)
    .then(() => {
      this.setState({currentShowOption: option});
    });
  }

  onSelectSortOption(option) {
    const { currentShowOption } = this.state;
    this.discover(currentShowOption, option)
    .then(() => {
      this.setState({currentSortOption: option});
    });
  }

  discover(show, sort) {
    const { fetchDiscover } = this.props;
    return fetchDiscover(show, sort);
  }
}

export default connect(mapStateToProps, {
  fetchDiscover,
  fetchGroupTags
})(Discover);

function mapStateToProps({ discover, groups, router }) {
  const { query } = router.location;
  return {
    discover,
    tags: groups.tags,
    i18n: i18n('en'),
    show: query.show,
    sort: query.sort,
  }
}
