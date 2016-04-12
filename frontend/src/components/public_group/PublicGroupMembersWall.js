import React from 'react';
import filterCollection from '../../lib/filter_collection';
import UserCard from '../../components/UserCard';

export default class PublicGroupMembersWall extends React.Component {
  _printTiersList() {
    const { group } = this.props;

    return ((group.tiers || []).map((tier, i) => (
      <div className='flex flex-wrap justify-center pb3' key={i}>
        {filterCollection(group.backers, {tier: tier.name}).map((user, j) => <UserCard user={user} key={j} className='m1' />)}
      </div>)
    ));
  }

  render() {
    return (
      <section id='members-wall' className='PublicGroup-MembersWall relative'>
        <div className='PublicGroupBackers container center relative'>
          <div className='container'>
            <h2 className='PublicGroup-title m0 -ff-sec -fw-bold'>This is possible thanks to you.</h2>
            <p className='PublicGroup-font-17 max-width-3 mx-auto mb3'>Proud members and sponsors support this collective and allow us to keep going towards our mission. We would not be here if it weren’t for these amazing people. Thank you so much.</p>
            {this._printTiersList()}
          </div>
        </div>
      </section>
    );
  }
};
