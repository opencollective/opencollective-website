import React, { Component } from 'react';
import { connect } from 'react-redux';

import debounce from 'lodash/debounce';
import merge from 'lodash/merge';
import values from 'lodash/values';

import roles from '../constants/roles';

import i18n from '../lib/i18n';

import notify from '../actions/notification/notify';
import updateGroup from '../actions/groups/update';
import uploadImage from '../actions/images/upload';

import Notification from '../containers/Notification';

import PublicFooter from '../components/PublicFooter';
import PublicGroupHero from '../components/public_group/PublicGroupHero';
import PublicGroupJoinUs from '../components/public_group/PublicGroupJoinUs';
import PublicGroupMembersWall from '../components/public_group/PublicGroupMembersWall';
import PublicGroupWhoWeAre from '../components/public_group/PublicGroupWhoWeAre';
import PublicGroupWhyJoin from '../components/public_group/PublicGroupWhyJoin';

import CustomTextArea from '../components/CustomTextArea';
import ImagePicker from '../components/ImagePicker';
import Input from '../components/Input';

const PRESET_LOGOS = [
  '/static/images/rocket.svg',
  '/static/images/code.svg',
  '/static/images/repo.svg',
];

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
  field: 'backgroundImage',
  extendStyle: (target, rect, scrollY, style) => {
    const height = Math.min(rect.height, 80);
    style.top = rect.top + scrollY - height;
    style.height = `${ height }px`;
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
  auxClassName: '-whyJoinText',
  field: 'whyJoin',
  extendStyle: function(target, rect, scrollY, style) {
    const whyJoinMediaRect = this.refs['PublicGroupWhyJoin'].refs['PublicGroupWhyJoin-whyJoinMedia'].getBoundingClientRect();
    style.left =  `${ whyJoinMediaRect.right }px`;
    style.width = 'auto';
  }
}, {
  refpath: 'PublicGroupWhyJoin/PublicGroupWhyJoin-whyJoinMedia',
  label: 'Update Media',
  buttonClassName: 'EditButton--Upload EditButton--left',
  auxClassName: '-whyJoinMedia',
  field: 'image',
  extendStyle: function(target, rect, scrollY, style) {
    const whyJoinTextRect = this.refs['PublicGroupWhyJoin'].refs['PublicGroupWhyJoin-whyJoinText'].getBoundingClientRect();
    style.right =  `${ whyJoinTextRect.left }px`;
    style.width = 'auto';
  }
},
].map(h => {
  h.ref = `${h.refpath}--highlight`;
  return h;
});

const Highlight = ({ ref, style, label, auxClassName, buttonClassName, onClick }) => (
  <div ref={ ref } className='EditCollective-Highlight' style={ style } onClick={ onClick }>
    <div className={`Highlight-aux ${ auxClassName }`}></div>
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
  <div className='EditCollective-Modal' onClick={e => {
    e.nativeEvent.stopImmediatePropagation();
    return false;
  }}>
    <div className='EditCollective-Modal-title'>
      <span>{ props.title }</span>
      <div className='-close' onClick={ props.onClose }>✖</div>
    </div>
    <div className='EditCollective-Modal-body'>
      { props.children }
      <div className='OnBoardingButton' onClick={ props.onClose }>Done</div>
    </div>
  </div>
);

const TopBar = props => (
  <div className='EditCollective-TopBar'>
    <div className='EditCollective-TopBar-brand'>
      <svg width='18px' height='18px' className='-light-blue align-middle mr1'>
        <use xlinkHref='#svg-isotype'/>
      </svg>
      <svg width='172px' height='30px' className='align-middle -logo-text'>
        <use xlinkHref='#svg-logotype' fill='#fff' />
      </svg>
    </div>
    <div className='EditCollective-TopBar-buttons'>
      <div className={`EditCollective-TopBar-Button ${ !props.canPublish ? '-disabled' : '' }`} onClick={ props.onPublish }>Save Changes</div>
      <a href='.'><div className='EditCollective-TopBar-Button trans'>Exit Edit Mode</div></a>
    </div>
  </div>
);

export class EditCollective extends Component {

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
        image: originalGroup.image,
        video: originalGroup.video,
      }
    };
    this.onCloseModalRef = this.onCloseModal.bind(this);
    this.onChangeHighlightValueRef = this.onChangeHighlightValue.bind(this);
    this.onPublishRef = this.onPublish.bind(this);
    this.lazyUpdateHighlights = debounce(() => {
      this.updateHighlights();
      this.forceUpdate();
    }, 400);
  }

  render() {
    const { originalGroup } = this.props;
    const { showModal, highlightLabel, highlightField, fields } = this.state;
    const highlightValue = highlightField ? fields[highlightField] : null;
    const groupChanged = Boolean(Object.keys(this.getUpdatedFields()).length);
    const group = {
      name: fields['name'] || ' ',
      backgroundImage: fields['backgroundImage'],
      logo: fields['logo'] || '/static/images/rocket.svg',
      mission: fields.mission,
      description: fields.description,
      longDescription: fields.longDescription,
      website: fields.website,
      tiers: originalGroup.tiers,
      members: [],
      contributors: originalGroup.contributors,
      whyJoin: fields.whyJoin,
      image: fields.image,
      video: fields.video,
      donationTotal: originalGroup.donationTotal,
      balance: originalGroup.balance,
      currency: originalGroup.currency,
    };
    return (
      <div className='EditCollective'>
        <Notification />
        <TopBar onPublish={ this.onPublishRef } canPublish={ groupChanged } />
        <Viewport>
          <PublicGroupHero ref='PublicGroupHero' group={ group } {...this.props} />
          <PublicGroupWhoWeAre ref='PublicGroupWhoWeAre' group={ group } {...this.props} />
          <PublicGroupWhyJoin ref='PublicGroupWhyJoin' group={ group } expenses={[]} {...this.props} />
          <div className='bg-light-gray px2 -joinUsAndMembersWall'>
            <PublicGroupJoinUs group={ group } donateToGroup={() => {}} {...this.props} />
            <PublicGroupMembersWall group={ group } {...this.props} />
          </div>
          <PublicFooter></PublicFooter>
        </Viewport>
        {showModal && (
          <Overlay onClick={ this.onCloseModalRef }>
            <Modal onClose={ this.onCloseModalRef } title={ highlightLabel } >
              {highlightField === 'backgroundImage' && (
                <ImagePicker
                  uploadOptionFirst
                  label='Choose a background image'
                  dontLookupSocialMediaAvatars
                  className="logo"
                  presets={ [ originalGroup.backgroundImage ] }
                  src={ highlightValue }
                  handleChange={ this.onChangeHighlightValueRef }
                  {...this.props} />
              )}
              {highlightField === 'description' && (
                <CustomTextArea cols='29' maxLength={125} value={ highlightValue } onChange={ this.onChangeHighlightValueRef } {...this.props}/>
              )}
              {highlightField === 'logo' && (
                <ImagePicker
                  uploadOptionFirst
                  label='Choose a logo or upload your own'
                  dontLookupSocialMediaAvatars
                  presets={ PRESET_LOGOS }
                  className="logo"
                  src={ highlightValue }
                  handleChange={ this.onChangeHighlightValueRef }
                  {...this.props} />
              )}
              {highlightField === 'longDescription' && (
                <CustomTextArea cols='29' {...this.props} value={ highlightValue } onChange={ this.onChangeHighlightValueRef } />
              )}
              {highlightField === 'mission' && (
                <CustomTextArea cols='29' {...this.props} value={ highlightValue } onChange={ this.onChangeHighlightValueRef } maxLength={100}/>
              )}
              {highlightField === 'name' && (
                <Input {...this.props} value={ highlightValue } handleChange={ this.onChangeHighlightValueRef } maxLength={255}/>
              )}
              {highlightField === 'website' && (
                <Input {...this.props} value={ highlightValue } handleChange={ this.onChangeHighlightValueRef } maxLength={255}/>
              )}
              {highlightField === 'whyJoin' && (
                <CustomTextArea cols='29' {...this.props} value={ highlightValue } onChange={ this.onChangeHighlightValueRef } />
              )}
              {highlightField === 'image' && (
                <ImagePicker
                  uploadOptionFirst
                  label='Choose media source'
                  className="logo"
                  dontLookupSocialMediaAvatars
                  presets={ PRESET_LOGOS }
                  src={ highlightValue }
                  handleChange={ this.onChangeHighlightValueRef }
                  {...this.props} />
              )}
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
    window.addEventListener('resize', this.lazyUpdateHighlights);
    this.forceUpdate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.lazyUpdateHighlights);
  }

  getUpdatedFields() {
    const { originalGroup } = this.props;
    const { fields } = this.state;
    const updatedFields = {};
    Object.keys(fields).forEach(fieldName => {
      if (originalGroup[fieldName] !== fields[fieldName]) {
        updatedFields[fieldName] = fields[fieldName];
      }
    })
    return updatedFields;
  }

  onPublish() {
    const { originalGroup, updateGroup } = this.props;
    const updatedFields = this.getUpdatedFields();
    if (Object.keys(updatedFields).length) {
      updateGroup(originalGroup.id, updatedFields)
      .catch(error => notify('error', error.message));
    }
  }

  onCloseModal(e) {
    const targetClassName = e.target.className;
    if (targetClassName === 'EditCollective-Overlay' || targetClassName === 'OnBoardingButton' || targetClassName === '-close' ) {
      this.setState({showModal: false});
    }
  }

  onChangeHighlightValue(newValue) {
    const { highlightField, fields } = this.state;
    fields[highlightField] = newValue;
    this.setState({fields: fields});
    this.updateHighlights();
  }

  onClickHighlight(highlight) {
    this.setState({
      showModal: true,
      highlightLabel: highlight.label,
      highlightField: typeof highlight.field === 'function' ? highlight.field(this.state) : highlight.field,
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
      if (!target) {
        h.style = {display: 'none'};
        return target;
      }
      const rect = target.getBoundingClientRect();
      const defaultStyle = {
        top: `${ rect.top + scrollY }px`,
        height: `${ rect.height }px`,
      };
      h.style = (customStyle ? defaultStyle : merge(defaultStyle, customStyle));
      if (extendStyle) extendStyle.call(this, target, rect, scrollY,  h.style);
    });
  }
}

export default connect(mapStateToProps, {
  notify,
  updateGroup,
  uploadImage,
})(EditCollective);
export function mapStateToProps({ groups }){
  const group = values(groups)[0] || {stripeAccount: {}}; // to refactor to allow only one group

  const usersByRole = group.usersByRole || {};
  group.members = usersByRole[roles.MEMBER] || [];
  group.backers = usersByRole[roles.BACKER] || [];
  group.hosts = usersByRole[roles.HOST] || [];
  group.tiers = group.tiers || [];
  group.host = group.hosts[0] || {};
  return {
    originalGroup: group,
    i18n: i18n('en'),
    donationForm: {}
  };
}
