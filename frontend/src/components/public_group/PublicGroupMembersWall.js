import React from 'react';
import UserCard from '../../components/UserCard';
import Mosaic from '../../components/Mosaic';

import _ from 'lodash';

export default class PublicGroupMembersWall extends React.Component {

  _showCards(users) {
    const { i18n } = this.props;
    return users.map((user, j) => (<UserCard ref={`UserCard-${j}`} user={user} key={j} className='m1' i18n={i18n} />));
  }

  render() {
    const { i18n, group } = this.props;
    this.membersAndBackers = _.uniqBy(_.union(group.members, group.backers.filter(b => !b.tier.match(/sponsor/i))), 'id');
    this.membersAndBackers = this.membersAndBackers.map(c => {
      c.href = `/${c.username}`;
      return c;
    });
    this.sponsors = _.uniqBy(group.backers.filter(b => b.tier.match(/sponsor/i)), 'id');
    return (
      <section id='contributors' className='PublicGroup-MembersWall relative'>
        <div className='PublicGroupBackers container center relative'>
          <div className='container'>
            <h2 className='PublicGroup-title m0 -ff-sec -fw-bold'>{i18n.getString('membersWallTitle')}</h2>
            <p className='PublicGroup-font-17 max-width-3 mx-auto mb3'>{i18n.getString('membersWallText')}</p>
            <div className='PublicGroupWhoWeAre-contributors' className='flex flex-wrap justify-center'>
            { this.membersAndBackers.length < 10 &&
              this._showCards(this.membersAndBackers)}
            { this.membersAndBackers.length > 10 &&
              <Mosaic hovercards={this.membersAndBackers} svg={`/${group.slug}/members.svg?exclude=sponsors&button=false&style=square&width=640&margin=0`} i18n={i18n} />
            }
            </div>
            <div className='PublicGroupWhoWeAre-sponsors' className='flex flex-wrap justify-center'>
              {this._showCards(this.sponsors)}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
