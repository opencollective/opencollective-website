import React, { PropTypes } from 'react';
import UserCard from '../../components/UserCard';
import Mosaic from '../../components/Mosaic';
import _ from 'lodash';

export default class CollectiveMembers extends React.Component {

  _showCards(users) {
    const { i18n } = this.props;
    return users.map((user, j) => (<UserCard ref={`UserCard-${j}`} user={user} key={j} className='m1' i18n={i18n} />));
  }

  render() {
    const { i18n, collective } = this.props;
    this.contributors = _.uniqBy(_.union(collective.members, collective.backers.filter(b => !b.tier.match(/sponsor/i))), 'id');
    this.contributors = this.contributors.map(c => {
      c.href = `/${c.username}`;
      return c;
    });
    this.sponsors = _.uniqBy(collective.backers.filter(b => b.tier.match(/sponsor/i)), 'id');
    return (
      <section id='contributors' className='Collective-MembersWall relative'>
        <div className='CollectiveBackers container center relative'>
          <div className='container'>
            <h2 className='Collective-title m0 -ff-sec -fw-bold'>{i18n.getString('membersWallTitle')}</h2>
            <p className='Collective-font-17 max-width-3 mx-auto mb3'>{i18n.getString('membersWallText')}</p>
            <div className='CollectiveWhoWeAre-contributors' className='flex flex-wrap justify-center'>
            { this.contributors.length < 10 &&
              this._showCards(this.contributors)}
            { this.contributors.length > 10 &&
              <Mosaic users={this.contributors} i18n={i18n} />
            }
            </div>
            <div className='CollectiveWhoWeAre-sponsors' className='flex flex-wrap justify-center'>
              {this._showCards(this.sponsors)}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

CollectiveMembers.propTypes = {
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
}
