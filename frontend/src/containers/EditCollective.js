import React, { Component } from 'react';
import { connect } from 'react-redux';
import merge from 'lodash/object/merge';

import i18n from '../lib/i18n';

import ContributorList from '../components/public_group/ContributorList';
import PublicFooter from '../components/PublicFooter';
import PublicGroupDonations from '../components/public_group/PublicGroupDonations';
import PublicGroupExpenses from '../components/public_group/PublicGroupExpenses';
import PublicGroupHero from '../components/public_group/PublicGroupHero';
import PublicGroupJoinUs from '../components/public_group/PublicGroupJoinUs';
import PublicGroupMembersWall from '../components/public_group/PublicGroupMembersWall';
import PublicGroupWhoWeAre from '../components/public_group/PublicGroupWhoWeAre';
import PublicGroupWhyJoin from '../components/public_group/PublicGroupWhyJoin';

const highlights = [ {
  refpath: 'PublicGroupHero/PublicGroupHero-logo',
  label: 'Update Logo',
  buttonClassName: 'EditButton--Upload'
}, {
  refpath: 'PublicGroupHero/PublicGroupHero-name',
  label: 'Update Name',
  buttonClassName: 'EditButton--Text'
}, {
  refpath: 'PublicGroupHero/PublicGroupHero-mission',
  label: 'Update Mission',
  buttonClassName: 'EditButton--Text'
}, {
  refpath: 'PublicGroupHero/PublicGroupHero-backgroundImage',
  label: 'Update Background',
  buttonClassName: 'EditButton--Image',
  extendStyle: (target, rect, scrollY, style) => {
    style.top = rect.top + scrollY - rect.height;
  }
}, {
  refpath: 'PublicGroupWhoWeAre/PublicGroupWhoWeAre-description',
  label: 'Update Description',
  buttonClassName: 'EditButton--Text'
}, {
  refpath: 'PublicGroupWhoWeAre/PublicGroupWhoWeAre-website',
  label: 'Update Website',
  buttonClassName: 'EditButton--Link'
}, {
  refpath: 'PublicGroupWhoWeAre/PublicGroupWhoWeAre-longDescription',
  label: 'Update Long Description',
  buttonClassName: 'EditButton--Text'
}, {
  refpath: 'PublicGroupWhyJoin/PublicGroupWhyJoin-whyJoinText',
  label: 'Update Text',
  buttonClassName: 'EditButton--Text'
},
].map(h => {
  h.ref = `${h.refpath}--highlight`;
  return h;
});

const Highlight = ({ ref, style, label, buttonClassName }) => (
  <div ref={ ref } className='EditCollective-highlight' style={ style }>
    <div className={`EditCollective-EditButton ${ buttonClassName }`}>
      <div className='EditCollective-EditButtonLabel'>{ label }</div>
    </div>
  </div>
);

const EditCollectiveViewport = props => (
  <div className='EditCollective-Viewport'>
    { props.children }
    <div className='-screen'></div>
  </div>
);

class EditCollectiveTopBar extends Component {
  render() {
    return (
      <div className='EditCollective-TopBar'>
        <div className='EditCollective-TopBar-container'>
        </div>
      </div>
    )
  }
}

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
      website: 'openfarm.cc',
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
        <EditCollectiveTopBar />
        <EditCollectiveViewport>
          <PublicGroupHero ref='PublicGroupHero' group={ group } {...this.props} />
          <PublicGroupWhoWeAre ref='PublicGroupWhoWeAre' group={ group } {...this.props} />
          <PublicGroupWhyJoin ref='PublicGroupWhyJoin' group={ group } expenses={[]} {...this.props} />
          <PublicGroupJoinUs group={ group } donateToGroup={ Function.prototype } {...this.props} />
          <PublicGroupMembersWall group={ group } {...this.props} />
          <PublicFooter></PublicFooter>
        </EditCollectiveViewport>
        { highlights.map(highlight => <Highlight { ...highlight } />) }
      </div>
    )
  }

  componentDidMount() {
    this.updateHighlights();
  }

  updateHighlights() {
    const scrollY = window.scrollY;
    highlights.forEach(h => {
      const extendStyle = h.extendStyle;
      const customStyle = h.customStyle;
      var context = this.refs;
      var target = null;
      var refpath = h.refpath.split('/');
      refpath.forEach(rpath => {
        if (context[rpath]) {
          target = context[rpath], 
          context = target.refs;
        } else {
          target = null;
        }
      });
      if (!target) return target;      
      const rect = target.getBoundingClientRect();
      const defaultStyle = {
        top: `${ rect.top + scrollY }px`,
        height: `${ rect.height }px`,
      };
      h.style = (customStyle ? defaultStyle : merge(defaultStyle, customStyle));
      if (extendStyle) extendStyle(target, rect, scrollY,  h.style);
    });
  }
}

export default connect(mapStateToProps, {})(EditCollective);
export function mapStateToProps({}){
  return {
    i18n: i18n('en')
  };
}
