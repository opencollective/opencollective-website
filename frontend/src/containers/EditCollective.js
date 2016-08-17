import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import PublicFooter from '../components/PublicFooter';
import PublicGroupHero from '../components/public_group/PublicGroupHero';
import PublicGroupWhoWeAre from '../components/public_group/PublicGroupWhoWeAre';
import PublicGroupWhyJoin from '../components/public_group/PublicGroupWhyJoin';
import PublicGroupJoinUs from '../components/public_group/PublicGroupJoinUs';
import PublicGroupMembersWall from '../components/public_group/PublicGroupMembersWall';
import PublicGroupExpenses from '../components/public_group/PublicGroupExpenses';
import PublicGroupDonations from '../components/public_group/PublicGroupDonations';
import ContributorList from '../components/public_group/ContributorList';

export default class EditCollective extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const group = {
      name: 'OpenFarm',
      backgroundImage: 'https://cldup.com/MYtRsISOBg.jpg',
      logo: 'https://openfarm.cc/assets/openfarm_logo_small-0d10c658a1abcd1ac7e3d6f37b5802cf.png',
      mission: 'develop a community and tools for freely sharing plant knowledge locally and globally.',
      description: 'A free and open database for farming and gardening knowledge. You can grow anything!',
      longDescription: 'OpenFarm is a free and open database and web application for farming and gardening knowledge. One might think of it as the Wikipedia or Freebase for growing plants, though it functions more like a cooking recipes site.\n\nThe main content are Growing Guides: creative, crowd-sourced, single-author, structured documents that include all of the necessary information for a person or machine to grow a plant, i.e.: seed spacing and depth, watering regimen, recommended soil composition and companion plants, sun/shade requirements, etc.\n\nOther use cases: a mobile app for home gardeners, Google providing “One Box” answers to search queries such as “How do I grow tomatoes?”, smart garden sensors, automated farming machines.',
      tiers:[],
      members:[
        {name: 'Simon Vansintjan', role: 'contributor', website: 'http://simon.vansintjan.net/'},
        {name: 'Rory Aronson', role: 'contributor', website: 'http://roryaronson.com/'}
      ],
      contributors:[
        {name: 'Rory Aronson', role: 'contributor', website: 'http://roryaronson.com/', stats: {}}
      ]
    };
    return (
      <div className='EditCollective'>
        <div className='EditCollective-TopBar'></div>
        <div className='-hspacer'></div>

        <div className='flex'>
          <div className='flex-auto'>
            <div className='flex'>
              <div className='-vspacer'></div>
              <div className='EditCollective-viewport flex-auto'>
                <PublicGroupHero group={group} {...this.props} />
                <div className='-screen'></div>
              </div>
            </div>
          </div>
          <div className='-vspacer'>
            <div className='EditCollective-EditButton'></div>
          </div>
        </div>

        <div className='-hspacer'></div>

        <div className='flex'>
          <div className='flex-auto'>
            <div className='flex'>
              <div className='-vspacer'></div>
              <div className='EditCollective-viewport flex-auto'>
                <PublicGroupWhoWeAre group={group} {...this.props} />
                <div className="PublicGroup-os-contrib-container">
                  <div className="line1" >{group.contributors.length} contributors</div>
                  <ContributorList contributors={group.contributors} />
                </div>
                <div className='-screen'></div>
              </div>
            </div>
          </div>
          <div className='-vspacer'></div>
        </div>

        <div className='-hspacer'></div>

        <div className='flex'>
          <div className='flex-auto'>
            <div className='flex'>
              <div className='-vspacer'></div>
              <div className='EditCollective-viewport flex-auto'>
                <PublicGroupWhyJoin group={group} expenses={[]} {...this.props} />
                <div className='-screen'></div>
              </div>
            </div>
          </div>
          <div className='-vspacer'></div>
        </div>




        <div className='-hspacer'></div>

        <div className='flex'>
          <div className='flex-auto'>
            <div className='flex'>
              <div className='-vspacer'></div>
              <div className='EditCollective-viewport flex-auto'>
                <div className='bg-light-gray px2'>
                  <PublicGroupJoinUs group={group} donateToGroup={Function.prototype} {...this.props} />
                  <PublicGroupMembersWall group={group} {...this.props} />
                </div>
                <div className='-screen'></div>
              </div>
            </div>
          </div>
          <div className='-vspacer'></div>
        </div>



        <div className='-hspacer'></div>

        <div className='flex'>
          <div className='flex-auto'>
            <div className='flex'>
              <div className='-vspacer'></div>
              <div className='EditCollective-viewport flex-auto'>
                <div className='container'>
                  <div className='PublicGroup-transactions clearfix md-flex'>
                    <PublicGroupExpenses group={group} expenses={[]} users={{}} itemsToShow={2} {...this.props} />
                    <PublicGroupDonations group={group} donations={[]} users={{}} itemsToShow={2} {...this.props} />
                  </div>
                </div>
                <PublicFooter></PublicFooter>
                <div className='-screen'></div>
              </div>
            </div>
          </div>
          <div className='-vspacer'></div>
        </div>





        <div className='-hspacer'></div>
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(EditCollective);
export function mapStateToProps({}){
  return {
    i18n: i18n('en')
  };
}
