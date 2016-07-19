import React from 'react';

import UserPhoto from '../UserPhoto';

const MAX_ITEMS_PER_PAGE = 16;

export default class ContributorList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      showHoverCard: false,
      hoverCardTarget: null
    };
  }

 render() {
  const { contributors } = this.props;
  const contributorsCopy = contributors.slice();
  const { pageIndex, showHoverCard, hoverCardTarget } = this.state;
  const prevIsPossible = this.prevIsPossible();
  const nextIsPossible = this.nextIsPossible();
  const pageCount = Math.floor(contributors.length / MAX_ITEMS_PER_PAGE) + 1;
  const pages = new Array(pageCount);
  for (let i = 0; i < pageCount; i++) {
    pages[i] = contributorsCopy.splice(0, MAX_ITEMS_PER_PAGE);
  }

  return (
      <div className='ContributorList'>
        <div className='ContributorList-body'>
          <div className='ContributorList-left'>
            <div className={`ImagePicker-prev ${prevIsPossible ? 'active' : ''}`} onClick={prevIsPossible ? this.prev.bind(this) : Function.prototype}></div>
          </div>
          <div className='ContributorList-right'>
            <div className={`ImagePicker-next ${nextIsPossible ? 'active' : ''}`} onClick={nextIsPossible ? this.next.bind(this) : Function.prototype}></div>
          </div>
          <div className='ContributorList-container'>
            {pages[pageIndex].map((contributor, index) => {
              return (
                <div key={index} className="ContributorList-item">
                  {showHoverCard && contributor === hoverCardTarget && (
                      <div className='ContributorList-HoverCard'>
                        <div className='HoverCard-name'>{contributor.name}</div>
                        <div className='HoverCard-role'>{contributor.core ? 'Core Contributor' : 'Contributor'}</div>
                        <div className='HoverCard-stats'>
                          <span></span>
                          <span>{`${contributor.stats.c} commits`}</span>
                          {typeof contributor.stats.a === 'number' &&
                            <span>
                              &nbsp;
                              <span>/</span>
                              &nbsp;
                              <span className='-add'>{`${contributor.stats.a}++`}</span>
                            </span>
                          }
                          {typeof contributor.stats.d === 'number' &&
                            <span>
                              &nbsp;
                              <span>/</span>
                              &nbsp;
                              <span className='-del'>{`${contributor.stats.d}--`}</span>
                            </span>
                          }
                        </div>
                      </div>
                    )
                  }
                  <UserPhoto
                    key={contributor.avatar}
                    user={{avatar: contributor.avatar}}
                    addBadge={contributor.core}
                    onMouseEnter={() => this.setHoverCard(contributor)}
                    onMouseLeave={() => this.setHoverCard()}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <div className='ContributorList-pagination'>
          <ul className='ImagePicker-dot-list'>
            {pages.map(
              (option, index) => {
                return <li key={index} onClick={() => this.setState({pageIndex: index})} className={pageIndex === index ? 'selected' : ''}></li>;
              }
            )}
          </ul>
        </div>
      </div>
    );
  }

  setHoverCard(target) {
    if (!target) {
      this.setState({showHoverCard: false});
    } else {
      this.setState({showHoverCard: true, hoverCardTarget: target});
    }
  }

  nextIsPossible() {
    const pageIndexCount = Math.floor(this.props.contributors.length / MAX_ITEMS_PER_PAGE);
    const { pageIndex } = this.state;
    return pageIndex < pageIndexCount;
  }

  prevIsPossible() {
    const { pageIndex } = this.state;
    return pageIndex > 0;
  }

  next() {
    this.setState({pageIndex: this.state.pageIndex + 1});
  }

  prev() {
    this.setState({pageIndex: this.state.pageIndex - 1});
  }
}
