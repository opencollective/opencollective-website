import React, { Component } from 'react';

import LoginTopBar from '../../containers/LoginTopBar';

import BackerCard from './BackerCard';
import PublicGroupContributors from './PublicGroupContributors';

import UserCard from '../UserCard';
import PublicFooter from '../PublicFooter';

function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default class PublicGroupPending extends Component {
  render() {
    const { group } = this.props;
    return (
      <div className='PublicGroup PublicGroup--inactive'>
        <LoginTopBar />
        <div className='PublicGroupHero-logo mb3 bg-contain' style={{backgroundImage: `url(${'https://cldup.com/U1yzUnB9YJ.png'})`}} ></div>
        <div className='line1'>Help <a href={ group.website }>{ group.name }</a> create an open collective to…</div>
        <div className='line2'>{ group.mission }</div>
        <div className='line3'>Help us get the first 10 backers to start the collective going.</div>
        <div className='line4'>With at least $10 you can become a member and help us cover design work, maintenance and servers.</div>
        { this.renderPendingBackers() }
        <div className='line5'>Thank you for your visit</div>
        { this.renderPendingContributors() }
        { this.renderPendingAbout() }
        <PublicFooter />
      </div>
    )
  }
  renderPendingBackers() {
    const { group, donateToGroup } = this.props;
    const backers = group.backers.slice(0);
    const backersCount = backers.length;
    if (backersCount < 10) {
      for (let i = 0, delta = 10 - backersCount; i < delta; i++) {
        backers.push(0)
      }
    }
    return (
      <div className='PublicGroup-backer-container'>
        <div className='-top-gradient'></div>
        <div className='-wrap'>
          {backers.map((backer, index) => {
            if (backer) {
              return <UserCard key={ index } user={ backer } { ...this.props }/>
            } else {
              return (
                <BackerCard
                  key={ index }
                  title={ `${getOrdinal(index+1)} Backer` }
                  group={ group }
                  user={{avatar: ''}}
                  showButton={ index === backersCount }
                  onToken={ donateToGroup }
                  { ...this.props }
                />
              )
            }
          })}
        </div>
        <div className='mb4'>
          <small style={{color: '#919699'}}>You won’t be charged a single penny until we reach our 10 backer goal.</small>
        </div>
        <div className='-bottom-gradient'></div>
      </div>
    )
  }

  renderPendingContributors() {
    const { group } = this.props;
    const githubContributors = group.data && group.data.githubContributors ? group.data.githubContributors : {};
    const contributors = Object.keys(githubContributors).map(username => {
      const commits = githubContributors[username]
      return {
        name: username,
        avatar: `https://avatars.githubusercontent.com/${ username }?s=96`,
        stats: {c: commits}
      }
    });

    if (!contributors.length) {
      return <div className='mt4'></div>;
    } else {
      return (
        <div>
          <div className='line6'>We are the contributors of this collective nice to meet you.</div>
          <div className='PublicGroup-contrib-container'>
            <div className='line1' >Contributors</div>
            <PublicGroupContributors contributors={ contributors } />
          </div>
        </div>
      )
    }
  }

  renderPendingAbout() {
    return (
      <div className='PublicGroup-about-container'>
        <div className='line1'>About Open Collective</div>
        <div className='line2'>
          We use [Open Collective host] to collect the funds on our behalf using OpenCollective. Whenever we need to use the money for something, we will submit the invoice or expense via the OpenCollective app and once approved we will be reimbursed. That way, you can always track our budget.
          <br/>
          <b>Everything is transparent.</b>
        </div>
        <div className='more-button'>learn more</div>
      </div>
    )
  }
}
