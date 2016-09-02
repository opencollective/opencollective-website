import React, { Component } from 'react';
import { connect } from 'react-redux';

import debounce from 'lodash/function/debounce';
import merge from 'lodash/object/merge';
import values from 'lodash/object/values';

import i18n from '../lib/i18n';

import PublicFooter from '../components/PublicFooter';
import PublicGroupHero from '../components/public_group/PublicGroupHero';
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
  field: 'backgroundImage',
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
      <svg width='172px' height='30px' className='align-middle'>
        <use xlinkHref='#svg-logotype' fill='#fff' />
      </svg>
    </div>
    <div className='EditCollective-TopBar-buttons'>
      <div className='EditCollective-TopBar-Button' onClick={ props.onPublish }>Publish</div>
      <a href='.'><div className='EditCollective-TopBar-Button trans'>Exit Edit Mode</div></a>
    </div>
  </div>
);

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
    const group = {
      name: fields['name'] || ' ',
      backgroundImage: fields['backgroundImage'],
      logo: fields['logo'] || '/static/images/rocket.svg',
      mission: fields['mission'],
      description: fields['description'],
      longDescription: fields['longDescription'],
      website: fields['website'],
      tiers:[],
      members:[],
      contributors: originalGroup.contributors
    };
    return (
      <div className='EditCollective'>
        <TopBar onPublish={ this.onPublishRef } />
        <Viewport>
          <PublicGroupHero ref='PublicGroupHero' group={ group } {...this.props} />
          <PublicGroupWhoWeAre ref='PublicGroupWhoWeAre' group={ group } {...this.props} />
          <PublicGroupWhyJoin ref='PublicGroupWhyJoin' group={ group } expenses={[]} {...this.props} />
          <PublicFooter></PublicFooter>
        </Viewport>
        {showModal && (
          <Overlay onClick={ this.onCloseModalRef }>
            <Modal onClose={ this.onCloseModalRef } title={ highlightLabel } >
              {highlightField === 'backgroundImage' && (
                <ImagePicker {...this.props} />
              )}
              {highlightField === 'description' && (
                <CustomTextArea cols='29' {...this.props} value={ highlightValue } onChange={ this.onChangeHighlightValueRef } />
              )}
              {highlightField === 'logo' && (
                <ImagePicker {...this.props} />
              )}
              {highlightField === 'longDescription' && (
                <CustomTextArea cols='29' {...this.props} value={ highlightValue } onChange={ this.onChangeHighlightValueRef } />
              )}
              {highlightField === 'mission' && (
                <CustomTextArea cols='29' {...this.props} value={ highlightValue } onChange={ this.onChangeHighlightValueRef } />
              )}
              {highlightField === 'name' && (
                <Input {...this.props} value={ highlightValue } />
              )}
              {highlightField === 'website' && (
                <Input {...this.props} value={ highlightValue } />
              )}
              {highlightField === 'whyJoin' && (
                <CustomTextArea cols='29' {...this.props} value={ highlightValue } onChange={ this.onChangeHighlightValueRef } />
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
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.lazyUpdateHighlights);
  }

  onPublish() {

  }

  onCloseModal(e) {
    const targetClassName = e.target.className;
    if (targetClassName === 'EditCollective-Overlay' || targetClassName === 'OnBoardingButton' || targetClassName === '-close' ) {
      this.setState({showModal: false});
    }
  }

  onChangeHighlightValue(newValue) {
    const { highlightField, fields } = this.state;
    if (fields[highlightField]) {
      fields[highlightField] = newValue;
      this.setState({fields: fields});
      this.updateHighlights();
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
