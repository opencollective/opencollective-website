import React, { Component, PropTypes } from 'react';

import UserPhoto from './UserPhoto';

export default class Mosaic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hovercard: false
    };

    let width = 64;
    if ( this.props.users.length > 50)
      width = 48;
    if ( this.props.users.length > 100)
      width = 24;

    this.avatarWidth = width;
  }

 render() {
  const { i18n, users } = this.props;
  const { hovercard } = this.state;

  if (users.length === 0) return (<div />);

  return (
    <div className='Mosaic'>

      {users.map((user, index) => {
        const style = { display: 'none' };
        if (hovercard && hovercard.index === index) {
          style.display =  'block';
          style.left = hovercard.posX;
          style.top = hovercard.posY;

          return (
            <div className='Mosaic-HoverCard' style={style} >
              <UserPhoto
                key={`hovercard-index-${index}`}
                user={{avatar: user.avatar}}
                addBadge={user.core}
                />
              <div className='HoverCard-name'>{user.name}</div>
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

      <div className='Mosaic-container'>
        {users.map((user, index) => {
          return (
            <div key={index} className="Mosaic-item" id={`userindex${index}`} >
              <a href={user.href} >
              <UserPhoto
                key={`userindex${index}`}
                user={{avatar: user.avatar}}
                addBadge={user.core}
                width={this.avatarWidth}
                fallbackOnError={false}
                onMouseEnter={() => this.setHoverCard(index)}
                onMouseLeave={() => this.setHoverCard()}
              />
              </a>
            </div>
          )
        })}
      </div>
    </div>
    );
  }

  setHoverCard(index) {
    if (!index) {
      this.setState({hovercard: false});
    } else {
      const el = document.querySelector(`.Mosaic #userindex${index}`);
      if (!el) return;

      this.setState({
        hovercard: {
          index,
          posX: el.offsetLeft - 105 + this.avatarWidth / 2,
          posY: el.offsetTop - 200
        }
      });
    }
  }

}

Mosaic.PropTypes = {
  i18n: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired
};