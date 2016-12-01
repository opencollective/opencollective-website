import React, { Component, PropTypes } from 'react';

import UserPhoto from './UserPhoto';

export default class Mosaic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hovercard: false
    };
  }

  render() {
    const { i18n, hovercards } = this.props;
    const { hovercard } = this.state;

    return (
    <div className='Mosaic'>

      {hovercards.map((user, index) => {
        const style = { display: 'none' };
        if (hovercard && hovercard.username === user.username) {
          style.display =  'block';
          style.left = hovercard.posX;
          style.top = hovercard.posY;

          return (
            <div className='Mosaic-HoverCard' key={`hovercard-${user.username}`} style={style} >
              <UserPhoto
                key={`hovercard-index-${index}`}
                user={{avatar: user.avatar}}
                addBadge={user.core}
                />
              <div className='HoverCard-name'>{user.name || user.username}</div>
              {user.tier && <div className='HoverCard-tier'>{user.tier}</div>}
              {user.createdAt && <div className='HoverCard-since'>{i18n.getString('since')} {i18n.moment(user.createdAt).format('MMMM YYYY')}</div>}
              {user.stats &&
                <div className='HoverCard-stats'>
                  <span></span>
                  <span>{`${user.stats.c} commits`}</span>
                  {typeof user.stats.a === 'number' &&
                    <span>
                      &nbsp;
                      <span>/</span>
                      &nbsp;
                      <span className='-add'>{`${user.stats.a}++`}</span>
                    </span>
                  }
                  {typeof user.stats.d === 'number' &&
                    <span>
                      &nbsp;
                      <span>/</span>
                      &nbsp;
                      <span className='-del'>{`${user.stats.d}--`}</span>
                    </span>
                  }
                </div>
              }
            </div>
          )
        }
      })}
      <object onMouseOut={this.onMouseOut.bind(this)} className="mosaic" type="image/svg+xml"></object>
    </div>
    );
  }

  componentDidMount() {
    const { svg } = this.props;
    this.el = React.findDOMNode(this).querySelector('.Mosaic object');
    this.el.style.opacity = 0;
    this.el.addEventListener('load', () => this.initMosaic());
    window.onresize = this.resizeMosaic.bind(this);
    if (svg)
      this.el.setAttribute('data', svg);
  }

  initMosaic() {
    this.avatars = this.el.contentDocument.querySelectorAll('a');
    let width = 64;
    if ( this.avatars.length > 50)
      width = 48;
    if ( this.avatars.length > 150)
      width = 24;

    this.avatarWidth = width;
    this.resizeMosaic();
    this.avatars.forEach(avatar => avatar.addEventListener('mouseover', () => this.setHoverCard(avatar)));
  }

  resizeMosaic() {
    if (!this.el) return;

    this.width = this.el.parentElement.getBoundingClientRect().width;
    const shouldRoundUp = ((this.width % this.avatarWidth) > (this.avatarWidth / 2));
    const roundingFn = (shouldRoundUp) ? Math.ceil : Math.floor;
    const avatarsPerRow = roundingFn(this.width / this.avatarWidth);
    const avatarWidth = Math.floor(this.width / avatarsPerRow);
    const height = Math.ceil(this.avatars.length / avatarsPerRow) * avatarWidth;
    this.el.setAttribute('width', this.width);
    this.el.setAttribute('height', height);
    this.avatars.forEach((avatar, index) => {
      const x = (index % avatarsPerRow) * avatarWidth;
      const y = Math.floor(index / avatarsPerRow) * avatarWidth;
      avatar.children[0].setAttribute('width', avatarWidth);
      avatar.children[0].setAttribute('height', avatarWidth);
      avatar.children[0].setAttribute('x', x);
      avatar.children[0].setAttribute('y', y);
    });
    this.el.style.opacity = 1;
  }

  onMouseOut() {
    this.setHoverCard(false);
  }

  setHoverCard(anchor) {
    if (!anchor) {
      this.setState({hovercard: false});
    } else {
      const rect = anchor.getBoundingClientRect();
      const hovercard = {
        username: anchor.id,
        posX: rect.left - 105 + this.avatarWidth / 2,
        posY: rect.top - 200
      };
      this.setState({ hovercard });
    }
  }

}

Mosaic.PropTypes = {
  i18n: PropTypes.object.isRequired,
  hovercards: PropTypes.object,
  svg: PropTypes.string.isRequired
};