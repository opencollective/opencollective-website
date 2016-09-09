import React, { Component } from 'react';
import { connect } from 'react-redux';

import debounce from 'lodash/debounce';
import values from 'lodash/values';

import roles from '../constants/roles';

import i18n from '../lib/i18n';

import notify from '../actions/notification/notify';
import updateGroup from '../actions/groups/update';
import uploadImage from '../actions/images/upload';

import Notification from '../containers/Notification';

import TopBar from '../components/edit_collective/EditCollectiveTopBar';
import Modal from '../components/edit_collective/EditCollectiveModal';
import Viewport from '../components/edit_collective/EditCollectiveViewport';
import Overlay from '../components/edit_collective/EditCollectiveOverlay';
import Highlight from '../components/edit_collective/EditCollectiveHighlight';
import EditCog from '../components/edit_collective/EditCollectiveEditCog';

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
}, {
  refpath: 'PublicGroupMembersWall/PublicGroupMembersWall-list',
  label: 'New Contributor',
  buttonClassName: 'EditButton--NewUser',
  field: 'backers',
  extendStyle: function(target, rect, scrollY, style) {
    style.left = 'auto';
    style.width = '0px';
  }
}
].map(h => {
  h.ref = `${h.refpath}--highlight`;
  return h;
});

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
        backers: originalGroup.backers,
      },
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
    const { showModal, highlightLabel, highlightField, highlightIndex, fields } = this.state;
    const highlightValue = highlightField ? fields[highlightField] : null;
    const groupChanged = Boolean(Object.keys(this.getUpdatedFields()).length);
    const createOrUpdateMembers = highlightField === 'backers';
    const memberBeingEdited = (createOrUpdateMembers) 
                                  ? (highlightValue[highlightIndex]) 
                                      ? highlightValue[highlightIndex] 
                                      : {name:'', website:'', avatar:'', core: false, _new: true} // new member
                                  : null;
    const group = {
      name: fields.name || ' ',
      backgroundImage: fields.backgroundImage,
      logo: fields.logo || '/static/images/rocket.svg',
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
      backers: fields.backers,
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
            <PublicGroupMembersWall ref='PublicGroupMembersWall' group={ group } {...this.props} />
          </div>
          <PublicFooter></PublicFooter>
        </Viewport>
        {showModal && (
          <Overlay onClick={ this.onCloseModalRef }>
            <Modal 
              onClose={ this.onCloseModalRef } 
              title={ highlightLabel } 
              className={ createOrUpdateMembers ? '-createOrUpdate' : '' }
              onDone={() => {
                this.onCloseModal({target:{className: '-close'}}); // TODO
              }}
              >
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
              {createOrUpdateMembers && (
                <div>
                  <ImagePicker
                    uploadOptionFirst
                    label='Choose avatar'
                    className='avatar'
                    dontLookupSocialMediaAvatars
                    src={ memberBeingEdited.avatar } 
                    handleChange={ val => memberBeingEdited.avatar = val }
                    {...this.props} />
                    <Input 
                      handleChange={val => {
                        memberBeingEdited.name = val;
                        fields[highlightField][highlightIndex] = memberBeingEdited;
                        this.setState({fields: fields});
                      }}
                      maxLength={255}
                      placeholder='Name'
                      value={ memberBeingEdited.name }
                      {...this.props} 
                    />
                    <Input
                      handleChange={val => {
                        memberBeingEdited.website = val;
                        fields[highlightField][highlightIndex] = memberBeingEdited;
                        this.setState({fields: fields});
                      }}
                      maxLength={255}
                      placeholder='Website (Optional)'
                      value={ memberBeingEdited.website }
                      {...this.props}
                    />
                    <div className='-radio-group'>
                      <input
                        checked={ !Boolean(memberBeingEdited.core) }
                        type="radio"
                        name="type"
                        value="regular"
                        onChange={(e) => {
                          memberBeingEdited.core = e.target.value === 'core';
                          fields[highlightField][highlightIndex] = memberBeingEdited;
                          this.setState({fields: fields});
                        }}
                      /><span>Regular</span>
                      <input
                        checked={ Boolean(memberBeingEdited.core) }
                        type="radio"
                        name="type"
                        value="core"
                        onChange={(e) => {
                          memberBeingEdited.core = e.target.value === 'core';
                          fields[highlightField][highlightIndex] = memberBeingEdited;
                          this.setState({fields: fields});
                        }}
                      /><span>Core</span>
                    </div>
                </div>
              )}
            </Modal>
          </Overlay>
        )}
        {highlights.map(highlight => {
          return <Highlight { ...highlight } onClick={ () => this.onClickHighlight(highlight) } />
        })}
        {this.refs.PublicGroupMembersWall && Object.keys(this.refs.PublicGroupMembersWall.refs).filter(x => x.indexOf('UserCard-') === 0).map((refName, i) => {
          const userCardElement = this.refs.PublicGroupMembersWall.refs[refName].refs.UserCard;
          const userCardRect = userCardElement.getBoundingClientRect();
          const scrollY = window.scrollY;
          const customStyle = {
            top: `${ userCardRect.top + scrollY - 15 }px`,
            left: `${ userCardRect.right - 15 }px`,
          };
          return (
            <EditCog
              key={ i }
              style={ customStyle } 
              onEdit={() => {
                this.setState({
                  showModal: true,
                  highlightLabel: 'Edit Contributor',
                  highlightField: 'backers',
                  highlightIndex: i
                });
              }}
              onRemove={() => {
                fields.backers.splice(highlightIndex, 1);
                this.setState({fields: fields});
                setTimeout(() => {
                  // Removal of refs is delayed, not sure why..
                  this.forceUpdate();
                }, 100)
              }}
            />
          )
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
      this.setState({showModal: false, highlightLabel: null, highlightField: null, highlightIndex: null});
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
      h.style = defaultStyle;
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
  group.backers = usersByRole[roles.BACKER] || [{tier: 'backer', 'name': 'Alfred'}, {tier: 'backer', 'name': 'Betty'}];
  group.hosts = usersByRole[roles.HOST] || [];
  group.tiers = group.tiers || [];
  group.host = group.hosts[0] || {};
  return {
    originalGroup: group,
    i18n: i18n('en'),
    donationForm: {}
  };
}
