import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoginTopBar from '../containers/LoginTopBar';
import Notification from '../containers/Notification';

import CustomTextArea from '../components/CustomTextArea';
import Input from '../components/CustomTextArea';
import PublicFooter from '../components/PublicFooter';
import Select from '../components/Select';

import appendGroupForm from '../actions/form/append_group';
import createGroup from '../actions/groups/create';
import notify from '../actions/notification/notify';
import validateSchema from '../actions/form/validate_schema';

import groupSchema from '../joi_schemas/newGroup';

export class AddGroup extends Component {

  constructor(props) {
    super(props);
    this.createRef = this.create.bind(this);
  }

  render() {
    const {
      appendGroupForm,
      groupForm
    } = this.props;

    const {
      name,
      slug,
      currency,
      website,
      video,
      mission,
      longDescription,
      logo,
      image,
      tags,
      users
    } = groupForm.attributes;


    const generateUserForm = (index) => {

      const updateUserAttribute = (index, name, value) => {
        const attributes = { users: {} };
        attributes.users[index] = {};
        attributes.users[index][name] = value;
        attributes.users[index]['role'] = 'MEMBER';
        appendGroupForm(attributes);
      };

      const editFieldForm = (attribute, placeholder) => {
        return (
          <div>
            <div className='AddGroup-label'>{attribute}</div>
            <Input
              name={attribute}
              value={users[index][attribute]}
              onChange={(value) => updateUserAttribute(index, attribute, value)}
              maxLength={50}
              placeholder={placeholder} />
          </div>
        );
      }

      return (
        <div className='flex flex-row' key={`addUser${index}`}>
          {editFieldForm('firstName', 'Charlie')}
          {editFieldForm('lastName', 'Chaplin')}
          {editFieldForm('email', 'charlie@chaps.com')}
          {editFieldForm('twitterHandle', 'charliechaps')}
          {editFieldForm('avatar', 'http://userinfo.com/image.png')}
        </div>
      );
    }

    const addUsersForm = [];
    users.forEach((item, index) => addUsersForm.push(generateUserForm(index)));

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
                        options={['USD', 'EUR', 'AUD', 'CAD', 'GBP', 'JPY', 'MXN', 'BRL']}
                        handleChange={(value) => appendGroupForm({currency: value})}/>

                      <div className='AddGroup-label'>Website</div>
                      <Input
                        name='website'
                        value={website}
                        onChange={(value) => appendGroupForm({website: value})}
                        maxLength={255}
                        placeholder='http://railsgirlsatlanta.com'/>

                      <div className='AddGroup-label'>Logo</div>
                      <Input
                        name='logo'
                        value={logo}
                        onChange={(value) => appendGroupForm({logo: value})}
                        maxLength={255}
                        placeholder='http://railsgirlsatlanta.com/rails.png'/>

                      <div className='AddGroup-label'>Image</div>
                      <Input
                        name='image'
                        value={image}
                        onChange={(value) => appendGroupForm({image: value})}
                        maxLength={255}
                        placeholder='http://railsgirlsatlanta.com/railscollective.png'/>

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
                    {addUsersForm}
                  </div>
                  <div className={`AddGroup-Button`} onClick={this.addUser.bind(this)}>Add user</div>
                </div>
              </div>
              <div className={`AddGroup-Button`} onClick={ this.createRef }>create!</div>
            </div>
        </div>
        <PublicFooter/>
      </div>
    );
  }

  addUser() {
    const {
      appendGroupForm,
      groupForm
    } = this.props;

    const users = groupForm.attributes.users;
    users.push({});
    const attributes = { users };
    appendGroupForm(attributes);
  }

  create() {
    const { groupForm, validateSchema, createGroup, utmSource, notify } = this.props;
    const attr = groupForm.attributes;
    const group = {
      tos: true,
      name: attr.name,
      slug: attr.slug,
      mission: attr.mission,
      description: attr.description,
      longDescription: attr.longDescription,
      logo: attr.logo,
      image: attr.image,
      website: attr.website,
      contribute: attr.contribute,
      video: attr.video,
      data: {
        utmSource
      },
      tags: attr.tags && attr.tags.split(',').map(x => x.trim()),
      users: attr.users,
      currency: attr.currency
    };

    return validateSchema(group, groupSchema)
      .then(() => createGroup(group))
      .then(() => this.setState({showConfirmation: true}))
      .then(() => notify('success', `${group.name} has been created. Refresh page to create a new group.`))
      .catch(({message}) => notify('error', message));
  }

}

export default connect(mapStateToProps, {
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
    utmSource
  };
}