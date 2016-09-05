import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoginTopBar from '../containers/LoginTopBar';
import Notification from '../containers/Notification';

import CustomTextArea from '../components/CustomTextArea';
import ImagePicker from '../components/ImagePicker';
import Input from '../components/CustomTextArea';
import PublicFooter from '../components/PublicFooter';
import Select from '../components/Select';

import appendGroupForm from '../actions/form/append_group';
import createGroup from '../actions/groups/create';
import notify from '../actions/notification/notify';
import uploadImage from '../actions/images/upload';
import validateSchema from '../actions/form/validate_schema';

import groupSchema from '../joi_schemas/group';

import i18n from '../lib/i18n';

const MEMBER = 'MEMBER';
const LOGO_PRESET = ['/static/images/repo.svg', '/static/images/code.svg', '/static/images/rocket.svg'];

export class AddGroup extends Component {

  constructor(props) {
    super(props);
    this.createRef = this.create.bind(this);
  }

  render() {
    const {
      appendGroupForm,
      groupForm,
      i18n,
      uploadImage
    } = this.props;

    const {
      name,
      slug,
      currency,
      website,
      video,
      mission,
      description,
      longDescription,
      whyJoin,
      tags,
      users1,
      users2,
      users3,
      users4,
      users5
    } = groupForm.attributes;

    return (
      <div className='Login'>
        <Notification {...this.props} />
        <LoginTopBar />
        <div className='AddGroup'>
          <div className='AddGroup-header'>
            <strong>Create a new collective</strong>
          </div>
            <div className='AddGroup-form-container'>
              <div className='sm-flex items-stretch'>
                <div className='order-2'>
                  <div className='AddGroup-imagepicker-cont pb3'>
                    <ImagePicker
                      uploadOptionFirst
                      className='logo'
                      dontLookupSocialMediaAvatars
                      handleChange={logo => appendGroupForm({logo})}
                      label='Select collective logo'
                      uploadImage={uploadImage}
                      i18n={i18n}
                      presets={LOGO_PRESET}
                    />
                    <ImagePicker
                      uploadOptionFirst
                      className='image'
                      dontLookupSocialMediaAvatars
                      handleChange={image => appendGroupForm({image})}
                      label='Select collective image'
                      uploadImage={uploadImage}
                      i18n={i18n}
                      presets={LOGO_PRESET}
                    />
                  </div>
                </div>
                <div className='sm-col-10 order-1 content-center'>
                  <div className='flex-auto'>
                    <div className='flex flex-column'>
                      <div className='AddGroup-label'>Name</div>
                      <Input
                        name='name'
                        value={name}
                        onChange={(value) => appendGroupForm({name: value})}
                        maxLength={50}
                        placeholder='Rails Girls Atlanta'/>

                      <div className='AddGroup-label'>Slug</div>
                      <Input
                        name='slug'
                        value={slug}
                        onChange={(value) => appendGroupForm({slug: value})}
                        maxLength={50}
                        placeholder='railsgirlatl'/>

                      <div className='AddGroup-label'>Currency </div>
                      <Select
                        name='currency'
                        value={currency || 'USD'}
                        options={['USD', 'EUR', 'AUD', 'CAD', 'GBP', 'JPY', 'MXN']}
                        handleChange={(value) => appendGroupForm({currency: value})}/>

                      <div className='AddGroup-label'>Website</div>
                      <Input
                        name='website'
                        value={website}
                        onChange={(value) => appendGroupForm({website: value})}
                        maxLength={100}
                        placeholder='http://railsgirlsatlanta.com'/>

                      <div className='AddGroup-label'>Video</div>
                      <Input
                        name='video'
                        value={video}
                        onChange={(value) => appendGroupForm({video: value})}
                        maxLength={255}
                        placeholder='http://railsgirlsatlanta.com'/>

                      <div className='AddGroup-label'>Help us on our mission to...</div>
                      <CustomTextArea
                        name='mission'
                        value={mission}
                        onChange={(value) => appendGroupForm({mission: value})}
                        maxLength={100}
                        placeholder='create a community for women to build their ideas'/>

                      <div className='AddGroup-label'>Describe your project briefly (short description) </div>
                      <CustomTextArea
                        name='description'
                        value={description}
                        onChange={(value) => appendGroupForm({description: value})}
                        maxLength={255}
                        placeholder='We enable learning rails in atlanta. duh.'/>

                      <div className='AddGroup-label'>Full description of your project</div>
                      <CustomTextArea
                        name='long description'
                        value={longDescription}
                        onChange={(value) => appendGroupForm({longDescription: value})}
                        maxLength={1000}
                        placeholder='We enable learning rails in atlanta. duh.'/>

                      <div className='AddGroup-label'>Why join?</div>
                      <CustomTextArea
                        name='why join'
                        value={whyJoin}
                        onChange={(value) => appendGroupForm({whyJoin: value})}
                        maxLength={100}
                        placeholder='to support us'/>

                      <div className='AddGroup-label'>Tag your project (comma-separated list)</div>
                      <CustomTextArea
                        name='tags'
                        value={tags}
                        onChange={(value) => appendGroupForm({tags: value})}
                        maxLength={100}
                        placeholder='ex: meetup, yoga, open source'/>
                    </div>
                  </div>
                </div>
              </div>

              <div className='AddGroup-title'>
                <strong> Add Core Contributors </strong>
              </div>

              <div className='sm-col-10 order-1 content-center'>
                <div className='flex-auto'>
                  <div className='flex flex-column'>
                    <div className='flex flex-row'>
                      <div>
                        <div className='AddGroup-label'>Name</div>
                        <Input
                          name='name'
                          value={users1.name}
                          onChange={(value) => appendGroupForm({users1: {name: value, email: users1.email, twitterHandle: users1.twitterHandle}})}
                          maxLength={50}
                          placeholder='Charlie Chaplin'/>
                      </div>
                      <div>
                        <div className='AddGroup-label'>Email</div>
                         <Input
                          name='email'
                          value={users1.email}
                          onChange={(value) => appendGroupForm({users1: {name: users1.name, email: value, twitterHandle: users1.twitterHandle}})}
                          maxLength={50}
                          placeholder='charlie@chaps.com'/>
                      </div>
                      <div>
                        <div className='AddGroup-label'>Twitterhandle </div>
                         <Input
                          name='twitterHandle'
                          value={users1.twitterHandle}
                          onChange={(value) => appendGroupForm({users1: {name: users1.name, email: users1.email, twitterHandle: value}})}
                          maxLength={50}
                          placeholder='@charliechaps'/>
                      </div>
                    </div>
                    <div className='flex flex-row'>
                      <div>
                        <div className='AddGroup-label'>Name</div>
                        <Input
                          name='name'
                          value={users2.name}
                          onChange={(value) => appendGroupForm({users2: {name: value, email: users2.email, twitterHandle: users2.twitterHandle}})}
                          maxLength={50}
                          placeholder='Charlie Chaplin'/>
                      </div>
                      <div>
                        <div className='AddGroup-label'>Email</div>
                         <Input
                          name='email'
                          value={users2.email}
                          onChange={(value) => appendGroupForm({users2: {name: users2.name, email: value, twitterHandle: users2.twitterHandle}})}
                          maxLength={50}
                          placeholder='charlie@chaps.com'/>
                      </div>
                      <div>
                        <div className='AddGroup-label'>Twitterhandle </div>
                         <Input
                          name='twitterHandle'
                          value={users2.twitterHandle}
                          onChange={(value) => appendGroupForm({users2: {name: users2.name, email: users2.email, twitterHandle: value}})}
                          maxLength={50}
                          placeholder='@charliechaps'/>
                      </div>
                    </div>
                    <div className='flex flex-row'>
                      <div>
                        <div className='AddGroup-label'>Name</div>
                        <Input
                          name='name'
                          value={users3.name}
                          onChange={(value) => appendGroupForm({users3: {name: value, email: users3.email, twitterHandle: users3.twitterHandle}})}
                          maxLength={50}
                          placeholder='Charlie Chaplin'/>
                      </div>
                      <div>
                        <div className='AddGroup-label'>Email</div>
                         <Input
                          name='email'
                          value={users3.email}
                          onChange={(value) => appendGroupForm({users3: {name: users3.name, email: value, twitterHandle: users3.twitterHandle}})}
                          maxLength={50}
                          placeholder='charlie@chaps.com'/>
                      </div>
                      <div>
                        <div className='AddGroup-label'>Twitterhandle </div>
                         <Input
                          name='twitterHandle'
                          value={users3.twitterHandle}
                          onChange={(value) => appendGroupForm({users3: {name: users3.name, email: users3.email, twitterHandle: value}})}
                          maxLength={50}
                          placeholder='@charliechaps'/>
                      </div>
                    </div>
                    <div className='flex flex-row'>
                      <div>
                        <div className='AddGroup-label'>Name</div>
                        <Input
                          name='name'
                          value={users4.name}
                          onChange={(value) => appendGroupForm({users4: {name: value, email: users4.email, twitterHandle: users4.twitterHandle}})}
                          maxLength={50}
                          placeholder='Charlie Chaplin'/>
                      </div>
                      <div>
                        <div className='AddGroup-label'>Email</div>
                         <Input
                          name='email'
                          value={users4.email}
                          onChange={(value) => appendGroupForm({users4: {name: users4.name, email: value, twitterHandle: users4.twitterHandle}})}
                          maxLength={50}
                          placeholder='charlie@chaps.com'/>
                      </div>
                      <div>
                        <div className='AddGroup-label'>Twitterhandle </div>
                         <Input
                          name='twitterHandle'
                          value={users4.twitterHandle}
                          onChange={(value) => appendGroupForm({users4: {name: users4.name, email: users4.email, twitterHandle: value}})}
                          maxLength={50}
                          placeholder='@charliechaps'/>
                      </div>
                    </div>
                    <div className='flex flex-row'>
                      <div>
                        <div className='AddGroup-label'>Name</div>
                        <Input
                          name='name'
                          value={users5.name}
                          onChange={(value) => appendGroupForm({users5: {name: value, email: users5.email, twitterHandle: users5.twitterHandle}})}
                          maxLength={50}
                          placeholder='Charlie Chaplin'/>
                      </div>
                      <div>
                        <div className='AddGroup-label'>Email</div>
                         <Input
                          name='email'
                          value={users5.email}
                          onChange={(value) => appendGroupForm({users5: {name: users5.name, email: value, twitterHandle: users5.twitterHandle}})}
                          maxLength={50}
                          placeholder='charlie@chaps.com'/>
                      </div>
                      <div>
                        <div className='AddGroup-label'>Twitterhandle </div>
                         <Input
                          name='twitterHandle'
                          value={users5.twitterHandle}
                          onChange={(value) => appendGroupForm({users5: {name: users5.name, email: users5.email, twitterHandle: value}})}
                          maxLength={50}
                          placeholder='@charliechaps'/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`AddGroup-Button`} onClick={ this.createRef }>create!</div>
            </div>
        </div>
        <PublicFooter/>
      </div>
    );
  }

  create() {
    const { groupForm, validateSchema, createGroup, utmSource, notify } = this.props;
    const attr = groupForm.attributes;
    const group = {
      name: attr.name,
      slug: attr.slug,
      mission: attr.mission,
      longDescription: attr.description,
      logo: attr.logo || '',
      website: attr.website,
      data: {
        utmSource
      },
      tags: attr.tags && attr.tags.split(',').map(x => x.trim()),
      users: [
        Object.assign({}, attr.users1, {role: MEMBER}),
        Object.assign({}, attr.users2, {role: MEMBER}),
        Object.assign({}, attr.users3, {role: MEMBER}),
        Object.assign({}, attr.users4, {role: MEMBER}),
        Object.assign({}, attr.users5, {role: MEMBER})],
      isPublic: true,
      currency: attr.currency
    };

    return validateSchema(groupForm.attributes, groupSchema)
      .then(() => createGroup(group))
      .then(() => this.setState({showConfirmation: true}))
      .then(() => notify('success', `${group.name} has been created. Refresh page to create a new group.`))
      .catch(({message}) => notify('error', message));
  }

}

export default connect(mapStateToProps, {
  uploadImage,
  appendGroupForm,
  notify,
  createGroup,
  validateSchema
})(AddGroup);

export function mapStateToProps({router, form}) {

  const query = router.location.query;
  const utmSource = query.utm_source;

  return {
    groupForm: form.addgroup,
    i18n: i18n('en'),
    utmSource
  };
}