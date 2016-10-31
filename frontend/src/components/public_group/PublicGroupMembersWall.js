import React from 'react';
import filterCollection from '../../lib/filter_collection';
import UserCard from '../../components/UserCard';
import _ from 'lodash';

export default class PublicGroupMembersWall extends React.Component {

  constructor(props) {
    super(props);
    this.membersIds = _.map(this.props.group.members,'id');
  }

  _showCards(users) {
    const { i18n } = this.props;
    return users.map((user, j) => (<UserCard ref={`UserCard-${j}`} user={user} key={j} className='m1' i18n={i18n} />));
  }

  render() {
    const { i18n, group } = this.props;

    const notAMember = (backer) => {
      return (this.membersIds.indexOf(backer.id) === -1);
    }

    return (
      <section id='members-wall' className='PublicGroup-MembersWall relative'>
        <div className='PublicGroupBackers container center relative'>
          <div className='container'>
            <h2 className='PublicGroup-title m0 -ff-sec -fw-bold'>{i18n.getString('membersWallTitle')}</h2>
            <p className='PublicGroup-font-17 max-width-3 mx-auto mb3'>{i18n.getString('membersWallText')}</p>
            <div className='PublicGroupWhoWeAre-contributors' className='flex flex-wrap justify-center'>
              {this._showCards(group.members)}
              {this._showCards(group.backers.filter(b => b.tier !== 'sponsor' && notAMember(b)))}
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
