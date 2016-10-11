import React from 'react';
import filterCollection from '../../lib/filter_collection';
import UserCard from '../../components/UserCard';

export default class PublicGroupMembersWall extends React.Component {

  _showCards(users) {
    const { i18n } = this.props;
    return users.map((user, j) => (<UserCard ref={`UserCard-${j}`} user={user} key={j} className='m1' i18n={i18n} />));
  }

  render() {
    const { i18n, group } = this.props;
    return (
      <section id='members-wall' className='PublicGroup-MembersWall relative'>
        <div className='PublicGroupBackers container center relative'>
          <div className='container'>
            <h2 className='PublicGroup-title m0 -ff-sec -fw-bold'>{i18n.getString('membersWallTitle')}</h2>
            <p className='PublicGroup-font-17 max-width-3 mx-auto mb3'>{i18n.getString('membersWallText')}</p>
            <div className='PublicGroupWhoWeAre-contributors' className='flex flex-wrap justify-center'>
              {this._showCards(group.members)}
              {this._showCards(group.backers.filter(b => b.tier !== 'sponsor'))}
            </div>
            <div className='PublicGroupWhoWeAre-sponsors' className='flex flex-wrap justify-center'>
              {this._showCards(filterCollection(group.backers, { tier: 'sponsor' }))}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
