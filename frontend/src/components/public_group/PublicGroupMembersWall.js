import React from 'react';
import UserCard from '../../components/UserCard';
import _ from 'lodash';

export default class PublicGroupMembersWall extends React.Component {

  constructor(props) {
    super(props);
    const { group } = props;
    this.contributors = _.uniqBy(_.union(group.members, group.backers.filter(b => !b.tier.match(/sponsor/i))), 'id');
    this.sponsors = _.uniqBy(group.backers.filter(b => b.tier.match(/sponsor/i)), 'id');
  }

  _showCards(users) {
    const { i18n, group } = this.props;
    if (!group.isSupercollective || users.length < 50) {
      return users.map((user, j) => (<UserCard ref={`UserCard-${j}`} user={user} key={j} className='m1' i18n={i18n} />));
    } else {
      return <span/>;
    }
  }

  render() {
    const { i18n } = this.props;
    return (
      <section id='contributors' className='PublicGroup-MembersWall relative'>
        <div className='PublicGroupBackers container center relative'>
          <div className='container'>
            <h2 className='PublicGroup-title m0 -ff-sec -fw-bold'>{i18n.getString('membersWallTitle')}</h2>
            <p className='PublicGroup-font-17 max-width-3 mx-auto mb3'>{i18n.getString('membersWallText')}</p>
            <div className='PublicGroupWhoWeAre-contributors' className='flex flex-wrap justify-center'>
              {this._showCards(this.contributors)}
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
