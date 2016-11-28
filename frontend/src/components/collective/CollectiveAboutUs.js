import React, { Component, PropTypes } from 'react';

import ContentEditable from '../../components/ContentEditable';
import Markdown from '../../components/Markdown';

export default class CollectiveAboutUs extends Component {
  render() {
    const { collective, i18n, canEditCollective, appendEditCollectiveForm, editCollectiveForm } = this.props;

    const {
      name,
      longDescription,
      canEditCollective
    } = editCollectiveForm;

    return (
      <section id='about_us' className='CollectiveAboutUs CollectiveIntro'>
        <div className='CollectiveIntro-container CollectiveAboutUs-container'>
          <h2 className='CollectiveAboutUs-title'>{ `${i18n.getString('weAre')} ` }
            <ContentEditable
              tagName='span'
              className='ContentEditable-name editing'
              html={ (name === '' || name) ? name : collective.name }
              disabled={ !canEditCollective }
              onChange={ event => appendEditCollectiveForm({name: event.target.value}) }
              placeholder={i18n.getString('defaultName')} />

          </h2>

          <div ref='CollectiveAboutUs-longDescription' className='Collective-markdown'>
            <Markdown
              value={ (longDescription === '' || longDescription) ? longDescription : collective.longDescription }
              canEdit={ canEditCollective }
              splitIntoSections={true}
              onChange = { longDescription => appendEditCollectiveForm({ longDescription })}
              {...this.props} />
          </div>
        </div>
      </section>
    );
  }
}

CollectiveAboutUs.propTypes = {
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  canEditCollective: PropTypes.bool.isRequired, 
  appendEditCollectiveForm: PropTypes.func.isRequired,
  editCollectiveForm: PropTypes.object.isRequired
}