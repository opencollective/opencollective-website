import React from 'react';

import UserPhoto from '../UserPhoto';

export default class ContributorList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hovercard: false
    };

    let width = 64;
    if ( this.props.contributors.length > 50)
      width = 48;
    if ( this.props.contributors.length > 100)
      width = 24;

    this.avatarWidth = width;
  }

 render() {
  const { contributors, i18n } = this.props;
  const { hovercard } = this.state;

  return (
    <div className='PublicGroup-os-contrib-container'>
      <div className='line1' >+{ contributors.length } {i18n.getString('contributorsOnGithub')}</div>

      <div className='ContributorList'>
      {contributors.map((contributor) => {
        const style = { display: 'none' };
        if (hovercard && hovercard.contributor === contributor.name) {
          style.display =  'block';
          style.left = hovercard.posX;
          style.top = hovercard.posY;

          return (
            <div className='ContributorList-HoverCard' style={style} >
              <UserPhoto
                key={contributor.avatar}
                user={{avatar: contributor.avatar}}
                addBadge={contributor.core}
                />
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
      })}

        <div className='ContributorList-container'>
          {contributors.map((contributor, index) => {
            return (
              <div key={index} className="ContributorList-item" id={contributor.name} >
                <a href={contributor.href} >
                <UserPhoto
                  key={contributor.avatar}
                  user={{avatar: contributor.avatar}}
                  addBadge={contributor.core}
                  width={this.avatarWidth}
                  onMouseEnter={() => this.setHoverCard(contributor.name)}
                  onMouseLeave={() => this.setHoverCard()}
                />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
    );
  }

  setHoverCard(contributor) {
    if (!contributor) {
      this.setState({hovercard: false});
    } else {
      const el = document.querySelector(`.ContributorList #${contributor}`);
      if (!el) return;

      this.setState({
        hovercard: {
          contributor,
          posX: el.offsetLeft - 105 + this.avatarWidth / 2,
          posY: el.offsetTop - 200
        }
      });
    }
  }

}
