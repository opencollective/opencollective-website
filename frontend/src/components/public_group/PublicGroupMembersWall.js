import React from 'react';
import filterCollection from '../../lib/filter_collection';
import UserCard from '../../components/UserCard';

export default class PublicGroupMembersWall extends React.Component {
  _printTiersList() {
    const { group, i18n } = this.props;

    const plural = (tiername) => `${tiername}s`;

    return ((group.tiers || []).map((tier, i) => (
      <div id={plural(tier.name)} className='flex flex-wrap justify-center pb3' key={i} ref='PublicGroupMembersWall-list' >
        {filterCollection(group.backers, {tier: tier.name}).map((user, j) => <UserCard ref={`UserCard-${j}`} user={user} key={j} className='m1' i18n={i18n} />)}
      </div>)
    ));
  }

  _printMembers() {
    const { group, i18n } = this.props;
    return ( group.members.length) ?  (
              <div ref='PublicGroupWhoWeAre-members' className='flex flex-wrap justify-center'>
                {group.members.map((user, index) => {
                  if (group.slug === 'opensource') user.tier = 'collective';
                  return <UserCard ref={`UserCard-${ index }`}  user={ user } key={ index } className='m1' i18n={ i18n } />
                  })
                }
            </div>
          ) : null;
  }

  render() {
    const { i18n } = this.props;
    return (
      <section id='members-wall' className='PublicGroup-MembersWall relative'>
        <div className='PublicGroupBackers container center relative'>
          <div className='container'>
            <h2 className='PublicGroup-title m0 -ff-sec -fw-bold'>{i18n.getString('membersWallTitle')}</h2>
            <p className='PublicGroup-font-17 max-width-3 mx-auto mb3'>{i18n.getString('membersWallText')}</p>
            {this._printMembers()}
            {this._printTiersList()}
          </div>
        </div>
      </section>
    );
  }
}
