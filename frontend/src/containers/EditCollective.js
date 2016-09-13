import React, { Component } from 'react';
import { connect } from 'react-redux';

import debounce from 'lodash/debounce';
import extend from 'lodash/extend';
import isEqual from 'lodash/isEqual';
import values from 'lodash/values';

import roles from '../constants/roles';

import i18n from '../lib/i18n';

import notify from '../actions/notification/notify';
import updateGroup from '../actions/groups/update';
import uploadImage from '../actions/images/upload';

import Notification from '../containers/Notification';

import EditCog from '../components/edit_collective/EditCollectiveEditCog';
import Highlight from '../components/edit_collective/EditCollectiveHighlight';
import Modal from '../components/edit_collective/EditCollectiveModal';
import Overlay from '../components/edit_collective/EditCollectiveOverlay';
import TopBar from '../components/edit_collective/EditCollectiveTopBar';
import Viewport from '../components/edit_collective/EditCollectiveViewport';

import PublicFooter from '../components/PublicFooter';
import PublicGroupHero from '../components/public_group/PublicGroupHero';
import PublicGroupJoinUs from '../components/public_group/PublicGroupJoinUs';
import PublicGroupMembersWall from '../components/public_group/PublicGroupMembersWall';
import PublicGroupWhoWeAre from '../components/public_group/PublicGroupWhoWeAre';
import PublicGroupWhyJoin from '../components/public_group/PublicGroupWhyJoin';

import CustomTextArea from '../components/CustomTextArea';
import ImagePicker from '../components/ImagePicker';
import Input from '../components/Input';

const SAMPLE_BACKERS = [
  {tier: 'backer', 'name': 'Alfred'}, 
  {tier: 'backer', 'name': 'Betty'}
];

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
  refpath: 'PublicGroupWhoWeAre/PublicGroupWhoWeAre-members',
  label: 'New Member',
  buttonClassName: 'EditButton--NewUser',
  field: 'members',
  extendStyle: function(target, rect, scrollY, style) {
    style.left = 'auto';
    style.width = '0px';
  } 
}
].map(h => {
  h.ref = `${h.refpath}--highlight`;
  return h;
});

const updateGroupMembers = (groupId, members) => new Promise((resolve) => {
  console.log('updateGroupMembers', groupId, members);
  resolve();
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
        members: originalGroup.members.map(x => JSON.parse(JSON.stringify(x))),
      },
      newMember: {}
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
    const { showModal } = this.state;
    const groupChanged = Boolean(Object.keys(this.getUpdatedFields()).length);
    const group = this.getGroupPreview();
    return (
      <div className='EditCollective'>
        <Notification />
        <TopBar onPublish={ this.onPublishRef } canPublish={ groupChanged } />
        <Viewport>
          <PublicGroupHero ref='PublicGroupHero' group={ group } {...this.props} />
          <PublicGroupWhoWeAre ref='PublicGroupWhoWeAre' group={ group } {...this.props} />
          <PublicGroupWhyJoin ref='PublicGroupWhyJoin' group={ group } expenses={[]} {...this.props} />
          <div className='-joinUsAndMembersWall'>
            <PublicGroupJoinUs group={ group } donateToGroup={ Function.prototype } {...this.props} />
            <PublicGroupMembersWall ref='PublicGroupMembersWall' group={ group } {...this.props} />
          </div>
          <PublicFooter></PublicFooter>
        </Viewport>
        { showModal && this.renderModal() }
        { this.renderHighlights() }
        { this.renderEditCogs() }
      </div>
    )
  }

  getGroupPreview() {
    const { originalGroup } = this.props;
    const { fields } = this.state;
    return {
      backgroundImage: fields.backgroundImage,
      balance: originalGroup.balance,
      contributors: originalGroup.contributors,
      currency: originalGroup.currency,
      description: fields.description || '--',
      donationTotal: originalGroup.donationTotal,
      image: fields.image,
      logo: fields.logo || '/static/images/rocket.svg',
      longDescription: fields.longDescription || '--',
      members: fields.members,
      mission: fields.mission || '--',
      name: fields.name || '--',
      tiers: originalGroup.tiers,
      video: fields.video,
      website: fields.website || '--',
      whyJoin: fields.whyJoin,
    };
  }

  renderModal() {
    const { originalGroup } = this.props;
    const { highlightLabel, highlightField, highlightIndex } = this.state;
    const fields = extend(this.state.fields);
    const highlightValue = highlightField ? fields[highlightField] : null;
    const createOrUpdateMembers = highlightField === 'members';
    const memberIsBeingCreated = createOrUpdateMembers && typeof highlightIndex !== 'number';
    const memberIsBeingEdited = createOrUpdateMembers && highlightIndex !== null;
    const modalProps = {
      onClose: this.onCloseModalRef,
      title: highlightLabel,
      className: createOrUpdateMembers ? '-createOrUpdate' : '',
      onDone: () => this.onCloseModal({target: {className: '-close'}}),
    };

    // Edit/Create Members 
    if (createOrUpdateMembers) {
      if (memberIsBeingCreated) {
        return this.renderModalForMemberCreate(modalProps);
      } else if (memberIsBeingEdited) {
        return this.renderModalForMemberEdit(modalProps);
      }
    }

    // Edit Group field
    return (
      <Overlay onClick={ this.onCloseModalRef }>
        <Modal {...modalProps}>
          {highlightField === 'backgroundImage' && (
            <ImagePicker
              className='logo'
              dontLookupSocialMediaAvatars
              handleChange={ this.onChangeHighlightValueRef }
              label='Choose a background image'
              presets={ originalGroup ? [ originalGroup.backgroundImage ] : [] }
              src={ highlightValue }
              uploadOptionFirst
              {...this.props} />
          )}
          {highlightField === 'description' && (
            <CustomTextArea
              cols='29'
              maxLength={125}
              onChange={ this.onChangeHighlightValueRef }
              value={ highlightValue }
              {...this.props} />
          )}
          {highlightField === 'logo' && (
            <ImagePicker
              className='logo'
              dontLookupSocialMediaAvatars
              handleChange={ this.onChangeHighlightValueRef }
              label='Choose a logo or upload your own'
              presets={ PRESET_LOGOS }
              src={ highlightValue }
              uploadOptionFirst
              {...this.props} />
          )}
          {highlightField === 'longDescription' && (
            <CustomTextArea
              cols='29'
              onChange={ this.onChangeHighlightValueRef }
              value={ highlightValue }
              {...this.props} />
          )}
          {highlightField === 'mission' && (
            <CustomTextArea
              cols='29'
              maxLength={100}
              onChange={ this.onChangeHighlightValueRef }
              value={ highlightValue }
              {...this.props} />
          )}
          {highlightField === 'name' && (
            <Input
              handleChange={ this.onChangeHighlightValueRef }
              maxLength={255}
              value={ highlightValue }
              {...this.props} />
          )}
          {highlightField === 'website' && (
            <Input
              handleChange={ this.onChangeHighlightValueRef }
              maxLength={255}
              value={ highlightValue }
              {...this.props} />
          )}
          {highlightField === 'whyJoin' && (
            <CustomTextArea
              cols='29'
              onChange={ this.onChangeHighlightValueRef }
              value={ highlightValue }
              {...this.props} />
          )}
          {highlightField === 'image' && (
            <ImagePicker
              className='logo'
              dontLookupSocialMediaAvatars
              handleChange={ this.onChangeHighlightValueRef }
              label='Choose media source'
              presets={ PRESET_LOGOS }
              src={ highlightValue }
              uploadOptionFirst
              {...this.props} />
          )}
        </Modal>
      </Overlay>
    )
  }

  renderModalForMemberEdit(modalProps) {
    const { highlightField, highlightIndex } = this.state;
    const fields = extend(this.state.fields, {});
    const member = fields[highlightField][highlightIndex];
    const setFieldOnChange = (propName) => {
      return val => {
        fields[highlightField][highlightIndex][propName] = val;
        member[propName] = val;
        this.setState({fields: fields});
      };
    };
    return (
      <Overlay onClick={ this.onCloseModalRef }>
        <Modal {...modalProps}>
          <ImagePicker
            className='avatar'
            dontLookupSocialMediaAvatars
            handleChange={ setFieldOnChange('avatar') }
            label='Choose avatar'
            src={ member.avatar }
            uploadOptionFirst
            {...this.props} />
            <Input
              handleChange={ setFieldOnChange('name') }
              maxLength={255}
              placeholder='Name'
              value={ member.name }
              {...this.props} />
            <Input
              handleChange={ setFieldOnChange('website') }
              maxLength={255}
              placeholder='Website (Optional)'
              value={ member.website }
              {...this.props} />
            <div className='-radio-group'>
              <input
                checked={ !member.core }
                type='radio'
                name='type'
                value='regular'
                onChange={e => setFieldOnChange('core')(e.target.value === 'core')} />
              <span>Regular</span>
              <input
                checked={ Boolean(member.core) }
                name='type'
                type='radio'
                value='core'
                onChange={e => setFieldOnChange('core')(e.target.value === 'core')} />
              <span>Core</span>
            </div>
        </Modal>
      </Overlay>
    )
  }

  renderModalForMemberCreate(modalProps) {
    const { highlightField } = this.state;
    const fields = extend(this.state.fields, {});
    const newMember = extend(this.state.newMember, {});
    const onCreateDone = () => {
      newMember.role = 'member';
      fields[highlightField].push(newMember);
      this.setState({fields: fields});
      this.onCloseModal({target:{className: '-close'}});
      this.delayedUpdate();
    };
    const setFieldOnChange = (propName) => {
      return val => {
        newMember[propName] = val;
        this.setState({newMember: newMember});
      };
    };
    return (
      <Overlay onClick={ this.onCloseModalRef }>
        <Modal {...modalProps} onDone={ onCreateDone }>
          <ImagePicker
            className='avatar'
            dontLookupSocialMediaAvatars
            handleChange={val => {
              newMember.avatar = val;
              this.setState({newMember: newMember});
            }}
            label='Choose avatar'
            src={ newMember.avatar }
            uploadOptionFirst
            {...this.props} />
            <Input
              handleChange={ setFieldOnChange('name') }
              maxLength={255}
              placeholder='Name'
              value={ newMember.name }
              {...this.props} />
            <Input
              handleChange={ setFieldOnChange('website') }
              maxLength={255}
              placeholder='Website (Optional)'
              value={ newMember.website }
              {...this.props} />
            <div className='-radio-group'>
              <input
                checked={ !newMember.core }
                type='radio'
                name='type'
                value='regular'
                onChange={e => setFieldOnChange('core')(e.target.value === 'core')} />
              <span>Regular</span>
              <input
                checked={ Boolean(newMember.core) }
                name='type'
                type='radio'
                value='core'
                onChange={e => setFieldOnChange('core')(e.target.value === 'core')} />
              <span>Core</span>
            </div>
        </Modal>
      </Overlay>
    )
  }

  renderHighlights() {
    return highlights.map(highlight => (
      <Highlight { ...highlight } onClick={ () => this.onClickHighlight(highlight) } />
    ));
  }

  renderEditCogs() {
    const { fields } = this.state;
    const isRefsReady = Boolean(this.refs.PublicGroupWhoWeAre);
    const scrollY = window.scrollY;
    if (isRefsReady) {
      const refList = Object.keys(this.refs.PublicGroupWhoWeAre.refs).filter(x => x.indexOf('UserCard-') === 0);
      return refList.map((refName, i) => {
        const member = fields.members[i];       // (fields.members && fields.members.length) ? fields.members[i] : {};
        const userCardElement = this.refs.PublicGroupWhoWeAre.refs[refName].refs.UserCard;
        const userCardRect = userCardElement.getBoundingClientRect();
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
                highlightLabel: 'Edit Member',
                highlightField: 'members',
                highlightIndex: i,
              });
            }}
            onRemove={() => {
              const indexOfMember = fields.members.indexOf(member);
              if (indexOfMember !== -1) {
                fields.members.splice(indexOfMember, 1);
              }
              this.setState({fields: fields});
              this.delayedUpdate();
            }}
          />
        )
      });
    }
  }

  /**
  * refs are updated AFTER a state is updated, so when creating/removing a component
  * that has a ref, it will not be visible until another state update is made.
  */
  delayedUpdate() {
    setTimeout(() => this.forceUpdate(), 100);
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
      console.log('testing', fieldName, originalGroup[fieldName], '===', fields[fieldName]);
      if (!isEqual(originalGroup[fieldName], fields[fieldName])) {
        updatedFields[fieldName] = fields[fieldName];
      }
    })
    console.log('getUpdatedFields', updatedFields);
    return updatedFields;
  }

  onPublish() {
    const { originalGroup, updateGroup } = this.props;
    const updatedFields = this.getUpdatedFields();
    if (Object.keys(updatedFields).length) {
      updateGroup(originalGroup.id, updatedFields)
      .then(() => {
        if (!isEqual(originalGroup.members, updatedFields.members)) {
          return updateGroupMembers(originalGroup.id, updatedFields.members);
        }
      })
      .catch(error => notify('error', error.message));
    }
  }

  onCloseModal(e) {
    const targetClassName = e.target.className;
    if (targetClassName === 'EditCollective-Overlay' || targetClassName === 'OnBoardingButton' || targetClassName === '-close' ) {
      this.setState({
        showModal: false,
        highlightLabel: null,
        highlightField: null,
        highlightIndex: null,
        newMember: {},
      });
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
      highlightField: highlight.field,
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
  group.members = usersByRole[roles.MEMBER] || SAMPLE_BACKERS || [];
  group.tiers = group.tiers || [];
  return {
    originalGroup: group,
    i18n: i18n('en'),
    donationForm: {}
  };
}
