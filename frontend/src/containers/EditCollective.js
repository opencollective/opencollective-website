import React, { Component } from 'react';
import { connect } from 'react-redux';

import merge from 'lodash/object/merge';
import values from 'lodash/object/values';

import i18n from '../lib/i18n';

import PublicFooter from '../components/PublicFooter';
import PublicGroupHero from '../components/public_group/PublicGroupHero';
import PublicGroupJoinUs from '../components/public_group/PublicGroupJoinUs';
import PublicGroupMembersWall from '../components/public_group/PublicGroupMembersWall';
import PublicGroupWhoWeAre from '../components/public_group/PublicGroupWhoWeAre';
import PublicGroupWhyJoin from '../components/public_group/PublicGroupWhyJoin';

import CustomTextArea from '../components/CustomTextArea';
import ImagePicker from '../components/ImagePicker';
import Input from '../components/Input';

const highlights = [ {
  refpath: 'PublicGroupHero/PublicGroupHero-logo',
  label: 'Update Logo',
  buttonClassName: 'EditButton--Upload',
  field: 'logo',
}, {
  refpath: 'PublicGroupHero/PublicGroupHero-name',
  label: 'Update Name',
  buttonClassName: 'EditButton--Text',
  field: 'name',
}, {
  refpath: 'PublicGroupHero/PublicGroupHero-mission',
  label: 'Update Mission',
  buttonClassName: 'EditButton--Text',
  field: 'mission',
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
  buttonClassName: 'EditButton--Text',
  field: 'description',
}, {
  refpath: 'PublicGroupWhoWeAre/PublicGroupWhoWeAre-website',
  label: 'Update Website',
  buttonClassName: 'EditButton--Link',
  field: 'website',
}, {
  refpath: 'PublicGroupWhoWeAre/PublicGroupWhoWeAre-longDescription',
  label: 'Update Long Description',
  buttonClassName: 'EditButton--Text',
  field: 'longDescription',
}, {
  refpath: 'PublicGroupWhyJoin/PublicGroupWhyJoin-whyJoinText',
  label: 'Update Text',
  buttonClassName: 'EditButton--Text',
  field: 'whyJoin',
},
].map(h => {
  h.ref = `${h.refpath}--highlight`;
  return h;
});

const Highlight = ({ ref, style, label, buttonClassName, onClick }) => (
  <div ref={ ref } className='EditCollective-Highlight' style={ style } onClick={ onClick }>
    <div className={`EditCollective-EditButton ${ buttonClassName }`}>
      <div className='EditCollective-EditButtonLabel'>{ label }</div>
    </div>
  </div>
);

const Viewport = props => (
  <div className='EditCollective-Viewport'>
    { props.children }
    <div className='-screen'></div>
  </div>
);

const Overlay = props => (
  <div className='EditCollective-Overlay' onClick={ props.onClick }>
    { props.children }
  </div>
);

const Modal = props => (
  <div className='EditCollective-Modal' onClick={ (e) => {
    e.nativeEvent.stopImmediatePropagation()
    return false;
  } }>
    <div className='EditCollective-Modal-title'>
      <span>{ props.title }</span>
      <div className='-close' onClick={ props.onClose }>✖</div>
    </div>
    <div className='EditCollective-Modal-body' onClick={ e => {
      e.nativeEvent.stopImmediatePropagation()
      return false; 
    } }>
      { props.children }
      <div className='OnBoardingButton'>Save Changes</div>
    </div>
  </div>
);

class TopBar extends Component {
  render() {
    return (
      <div className='EditCollective-TopBar'>
        <div className='EditCollective-TopBar-brand'>
          <svg width='18px' height='18px' className='-light-blue align-middle mr1'>
            <use xlinkHref='#svg-isotype'/>
          </svg>
          <svg width='172px' height='30px' className='align-middle'>
            <use xlinkHref='#svg-logotype' fill='#fff' />
          </svg>
        </div>
        <div className='EditCollective-TopBar-buttons'>
          <a href='.'><div className='EditCollective-TopBar-Button trans'>Exit Edit Mode</div></a>
        </div>
      </div>
    )
  }
}

export default class EditCollective extends Component {
  
  constructor(props) {
    super(props);
    const originalGroup = props.originalGroup;
    this.state = {
      showModal: false,
      highlightLabel: null,
      highlightField: null,
      fields: {
        backgroundImage: originalGroup.backgroundImage,
        description: originalGroup.description,
        logo: originalGroup.logo,
        longDescription: originalGroup.longDescription,
        mission: originalGroup.mission,
        name: originalGroup.name,
        website: originalGroup.website,
        whyJoin: originalGroup.whyJoin,
      }
    };
    this.onCloseModalRef = this.onCloseModal.bind(this);
  }

  render() {
    const { showModal, highlightLabel, highlightField, fields } = this.state;
    const group = { // originalGroup
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
        <TopBar />
        <Viewport>
          <PublicGroupHero ref='PublicGroupHero' group={ group } {...this.props} />
          <PublicGroupWhoWeAre ref='PublicGroupWhoWeAre' group={ group } {...this.props} />
          <PublicGroupWhyJoin ref='PublicGroupWhyJoin' group={ group } expenses={[]} {...this.props} />
          <PublicGroupJoinUs group={ group } donateToGroup={ Function.prototype } {...this.props} />
          <PublicGroupMembersWall group={ group } {...this.props} />
          <PublicFooter></PublicFooter>
        </Viewport>
        {showModal && (
          <Overlay onClick={ this.onCloseModalRef }>
            <Modal onClose={ this.onCloseModalRef } title={ highlightLabel } >
              { highlightField === 'backgroundImage' && <ImagePicker {...this.props} /> }
              { highlightField === 'description' && <CustomTextArea cols='29' {...this.props} value={ fields[highlightField] } /> }
              { highlightField === 'logo' && <ImagePicker {...this.props} /> }
              { highlightField === 'longDescription' && <CustomTextArea cols='29' {...this.props} value={ fields[highlightField] } /> }
              { highlightField === 'mission' && <CustomTextArea cols='29' {...this.props} value={ fields[highlightField] } /> }
              { highlightField === 'name' && <Input {...this.props} value={ fields[highlightField] } /> }
              { highlightField === 'website' && <Input {...this.props} value={ fields[highlightField] } /> }
              { highlightField === 'whyJoin' && <CustomTextArea cols='29' {...this.props} value={ fields[highlightField] } /> }
            </Modal>
          </Overlay>
        )}
        {highlights.map(highlight => {
          return <Highlight { ...highlight } onClick={ () => this.onClickHighlight(highlight) } />
        })}
      </div>
    )
  }

  componentDidMount() {
    this.updateHighlights();
  }

  onCloseModal(e) {
    const targetClassName = e.target.className;
    if (targetClassName === 'EditCollective-Overlay' || targetClassName === '-close' ) {
      this.setState({showModal: false});
    }
  }

  onClickHighlight(highlight) {
    this.setState({
      showModal: true,
      highlightLabel: highlight.label,
      highlightField: highlight.field,
    });
  }

  updateHighlights() {
    const scrollY = window.scrollY;
    highlights.forEach(h => {
      const extendStyle = h.extendStyle;
      const customStyle = h.customStyle;
      let context = this.refs;
      let target = null;
      h.refpath.split('/').forEach(rpath => {
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
export function mapStateToProps({ groups }){
  const group = values(groups)[0] || {stripeAccount: {}}; // to refactor to allow only one group
  group.tiers = group.tiers || [];
  return {
    originalGroup: group,
    i18n: i18n('en')
  };
}
