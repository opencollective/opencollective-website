import React, { PropTypes } from 'react';
import UserCard from '../../components/UserCard';
import Mosaic from '../../components/Mosaic';
import GithubContributors from '../../components/collective/GithubContributors';
import _ from 'lodash';

export default class CollectiveMembers extends React.Component {

  _showCards(users) {
    const { i18n } = this.props;
    return users.map((user, j) => (<UserCard ref={`UserCard-${j}`} user={user} key={j} className='m1' i18n={i18n} />));
  }

  render() {
    const { i18n, collective } = this.props;
    this.membersAndBackers = _.uniqBy(_.union(collective.members, collective.backers.filter(b => !b.tier.match(/sponsor/i))), 'id');
    this.membersAndBackers = this.membersAndBackers.map(c => {
      c.href = `/${c.username}`;
      return c;
    });
    this.sponsors = _.uniqBy(collective.backers.filter(b => b.tier.match(/sponsor/i)), 'id');
    return (
      <section id='contributors' className='CollectiveMembers relative'>
        <div className='container center'>
          <h2 className='m0 -ff-sec -fw-bold'>{i18n.getString('membersWallTitle')}</h2>
          <p className='Collective-font-17 max-width-3 mx-auto mb3'>{i18n.getString('membersWallText')}</p>
        </div>
        <div className='CollectiveMembers-backers' className='flex flex-wrap justify-center'>
          { this.membersAndBackers.length <= 20 &&
            this._showCards(this.membersAndBackers)}
          { this.membersAndBackers.length > 20 &&
            <Mosaic hovercards={this.membersAndBackers} svg={`/${collective.slug}/members.svg?exclude=sponsors&button=false&width=640&margin=5`} i18n={i18n} />
          }
        </div>
        <div className='CollectiveMembers-sponsors' className='flex flex-wrap justify-center'>
          {this._showCards(this.sponsors)}
        </div>
        {collective.contributors && <GithubContributors collective={collective} i18n={i18n} />}
      </section>
    );
  }
}

CollectiveMembers.propTypes = {
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
}
