import React, { Component } from 'react';
import { connect } from 'react-redux';

import debounce from 'lodash/debounce';
import values from 'lodash/values';
import isEqual from 'lodash/isEqual';

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
        members: originalGroup.members,
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
      name: fields.name || ' ',
      backgroundImage: fields.backgroundImage,
      logo: fields.logo || '/static/images/rocket.svg',
      mission: fields.mission,
      description: fields.description,
      longDescription: fields.longDescription,
      website: fields.website,
      tiers: originalGroup.tiers,
      contributors: originalGroup.contributors,
      whyJoin: fields.whyJoin,
      image: fields.image,
      video: fields.video,
      donationTotal: originalGroup.donationTotal,
      balance: originalGroup.balance,
      currency: originalGroup.currency,
      members: fields.members,
    };
  }

  renderModal() {
    const { originalGroup } = this.props;
    const { highlightLabel, highlightField, highlightIndex, fields, newMember } = this.state;
    const createOrUpdateMembers = highlightField === 'members';
    const highlightValue = highlightField ? fields[highlightField] : null;
    const modalProps = {
      onClose: this.onCloseModalRef,
      title: highlightLabel,
      className: createOrUpdateMembers ? '-createOrUpdate' : '',
      onDone: () => { 
        this.onCloseModal({
          target: {className: '-close'}
        });
      }
    };

    if (highlightField === 'backgroundImage') {
      return (
        <Overlay onClick={ this.onCloseModalRef }>
          <Modal {...modalProps}>
            <ImagePicker
              className='logo'
              dontLookupSocialMediaAvatars
              handleChange={ this.onChangeHighlightValueRef }
              label='Choose a background image'
              presets={ [ originalGroup.backgroundImage ] }
              src={ highlightValue }
              uploadOptionFirst
              {...this.props} />
          </Modal>
        </Overlay>
      )
    }

    if (highlightField === 'description') {
      return (
        <Overlay onClick={ this.onCloseModalRef }>
          <Modal {...modalProps}>
            <CustomTextArea
              cols='29'
              maxLength={125}
              onChange={ this.onChangeHighlightValueRef }
              value={ highlightValue }
              {...this.props} />
          </Modal>
        </Overlay>
      )
    }

    if (highlightField === 'logo') {
      return (
        <Overlay onClick={ this.onCloseModalRef }>
          <Modal {...modalProps}>
            <ImagePicker
              className='logo'
              dontLookupSocialMediaAvatars
              handleChange={ this.onChangeHighlightValueRef }
              label='Choose a logo or upload your own'
              presets={ PRESET_LOGOS }
              src={ highlightValue }
              uploadOptionFirst
              {...this.props} />
          </Modal>
        </Overlay>
      )
    }

    if (highlightField === 'longDescription') {
      return (
        <Overlay onClick={ this.onCloseModalRef }>
          <Modal {...modalProps}>
            <CustomTextArea
              cols='29'
              onChange={ this.onChangeHighlightValueRef }
              value={ highlightValue }
              {...this.props} />
          </Modal>
        </Overlay>
      )
    }

    if (highlightField === 'mission') {
      return (
        <Overlay onClick={ this.onCloseModalRef }>
          <Modal {...modalProps}>
            <CustomTextArea
              cols='29'
              maxLength={100}
              onChange={ this.onChangeHighlightValueRef }
              value={ highlightValue }
              {...this.props} />
          </Modal>
        </Overlay>
      )
    }

    if (highlightField === 'name') {
      return (
        <Overlay onClick={ this.onCloseModalRef }>
          <Modal {...modalProps}>
            <Input
              handleChange={ this.onChangeHighlightValueRef }
              maxLength={255}
              value={ highlightValue }
              {...this.props} />
          </Modal>
        </Overlay>
      )
    }

    if (highlightField === 'website') {
      return (
        <Overlay onClick={ this.onCloseModalRef }>
          <Modal {...modalProps}>
            <Input
              handleChange={ this.onChangeHighlightValueRef }
              maxLength={255}
              value={ highlightValue }
              {...this.props} />
          </Modal>
        </Overlay>
      )
    }

    if (highlightField === 'whyJoin') {
      return (
        <Overlay onClick={ this.onCloseModalRef }>
          <Modal {...modalProps}>
            <CustomTextArea
              cols='29'
              onChange={ this.onChangeHighlightValueRef }
              value={ highlightValue }
              {...this.props} />
          </Modal>
        </Overlay>
      )
    }

    if (highlightField === 'image') {
      return (
        <Overlay onClick={ this.onCloseModalRef }>
          <Modal {...modalProps}>
            <ImagePicker
              className='logo'
              dontLookupSocialMediaAvatars
              handleChange={ this.onChangeHighlightValueRef }
              label='Choose media source'
              presets={ PRESET_LOGOS }
              src={ highlightValue }
              uploadOptionFirst
              {...this.props} />
          </Modal>
        </Overlay>
      )
    }

    const setFieldOnChange = propName => {
      return val => {
        fields[highlightField][highlightIndex][propName] = val;
        this.setState({fields: fields});
      };
    };
    const onCreateDone = () => {
      newMember.role = 'member';
      fields[highlightField].push(newMember);
      this.setState({fields: fields});
      this.onCloseModal({target:{className: '-close'}});
      this.delayedUpdate();
    };
    const memberIsBeingCreated = typeof highlightIndex !== 'number';
    const memberIsBeingEdited = highlightIndex !== null;
    if (createOrUpdateMembers) {
      if (memberIsBeingCreated) {
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
                  handleChange={val => {
                    newMember.name = val;
                    this.setState({newMember: newMember});
                  }}
                  maxLength={255}
                  placeholder='Name'
                  value={ newMember.name }
                  {...this.props} />
                <Input
                  handleChange={val => {
                    newMember.website = val;
                    this.setState({newMember: newMember});
                  }}
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
                    onChange={e => {
                      newMember.core = (e.target.value === 'core');
                      this.setState({newMember: newMember});
                    }} />
                  <span>Regular</span>
                  <input
                    checked={ Boolean(newMember.core) }
                    name='type'
                    type='radio'
                    value='core'
                    onChange={e => {
                      newMember.core = (e.target.value === 'core');
                      this.setState({newMember: newMember});
                    }} />
                  <span>Core</span>
                </div>
            </Modal>
          </Overlay>
        )
      }

      if (memberIsBeingEdited) {
        return (
          <Overlay onClick={ this.onCloseModalRef }>
            <Modal {...modalProps}>
              <ImagePicker
                className='avatar'
                dontLookupSocialMediaAvatars
                handleChange={ setFieldOnChange('avatar') }
                label='Choose avatar'
                src={ fields[highlightField][highlightIndex].avatar } 
                uploadOptionFirst
                {...this.props} />
                <Input
                  handleChange={ setFieldOnChange('name') }
                  maxLength={255}
                  placeholder='Name'
                  value={ fields[highlightField][highlightIndex].name }
                  {...this.props} />
                <Input
                  handleChange={ setFieldOnChange('website') }
                  maxLength={255}
                  placeholder='Website (Optional)'
                  value={ fields[highlightField][highlightIndex].website }
                  {...this.props} />
                <div className='-radio-group'>
                  <input
                    checked={ !fields[highlightField][highlightIndex].core }
                    type='radio'
                    name='type'
                    value='regular'
                    onChange={e => {
                      fields[highlightField][highlightIndex].core = (e.target.value === 'core');
                      this.setState({fields: fields});
                    }} />
                  <span>Regular</span>
                  <input
                    checked={ Boolean(fields[highlightField][highlightIndex].core) }
                    name='type'
                    type='radio'
                    value='core'
                    onChange={e => {
                      fields[highlightField][highlightIndex].core = (e.target.value === 'core');
                      this.setState({fields: fields});
                    }} />
                  <span>Core</span>
                </div>
            </Modal>
          </Overlay>
        )
      }
    }
  }

  renderHighlights() {
    return highlights.map(highlight => (
      <Highlight { ...highlight } onClick={ () => this.onClickHighlight(highlight) } />
    ));
  }

  renderEditCogs() {
    const { highlightIndex, fields } = this.state;
    const isRefReady = Boolean(this.refs.PublicGroupWhoWeAre);
    if (isRefReady) {
      const refList = Object.keys(this.refs.PublicGroupWhoWeAre.refs).filter(x => x.indexOf('UserCard-') === 0);
      return refList.map((refName, i) => {
        const userCardElement = this.refs.PublicGroupWhoWeAre.refs[refName].refs.UserCard;
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
                highlightLabel: 'Edit Member',
                highlightField: 'members',
                highlightIndex: i
              });
            }}
            onRemove={() => {
              fields.members.splice(highlightIndex, 1);
              this.setState({fields: fields});
              this.delayedUpdate();
            }}
          />
        )
      });
    }
  }

  /**
  * refs are updated AFTER a state updated, so when creating/removing a component
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
      if (!isEqual(originalGroup[fieldName], fields[fieldName])) {
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
      this.setState({showModal: false, highlightLabel: null, highlightField: null, highlightIndex: null, newMember: {}});
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
  group.members = usersByRole[roles.MEMBER] || [{tier: 'backer', 'name': 'Alfred'}, {tier: 'backer', 'name': 'Betty'}];
  group.tiers = group.tiers || [];
  return {
    originalGroup: group,
    i18n: i18n('en'),
    donationForm: {}
  };
}
