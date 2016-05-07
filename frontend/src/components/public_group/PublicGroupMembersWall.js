import React from 'react';
import filterCollection from '../../lib/filter_collection';
import UserCard from '../../components/UserCard';

export default class PublicGroupMembersWall extends React.Component {
  _printTiersList() {
    const { group, i18n } = this.props;

    return ((group.tiers || []).map((tier, i) => (
      <div className='flex flex-wrap justify-center pb3' key={i}>
        {filterCollection(group.backers, {tier: tier.name}).map((user, j) => <UserCard user={user} key={j} className='m1' i18n={i18n} />)}
      </div>)
    ));
  }

  render() {
    const { i18n } = this.props;
    return (
      <section id='members-wall' className='PublicGroup-MembersWall relative'>
        <div className='PublicGroupBackers container center relative'>
          <div className='container'>
            <h2 className='PublicGroup-title m0 -ff-sec -fw-bold'>{i18n.getString('membersWallTitle')}</h2>
            <p className='PublicGroup-font-17 max-width-3 mx-auto mb3'>{i18n.getString('membersWallText')}</p>
            {this._printTiersList()}
          </div>
        </div>
      </section>
    );
  }
};
