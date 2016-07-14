import React, { Component } from 'react';
import Input from './Input';
import SubmitButton from './SubmitButton';

import { connect } from 'react-redux';
import values from 'lodash/object/values';
import appendTwitterTemplatesForm from '../actions/form/append_twitter_templates';
import updateGroup from '../actions/groups/update';

export class EditTwitterTemplates extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    const originalTemplates = this.props.group.settings.twitterTemplates;
    const appendTwitterTemplatesForm = this.props.appendTwitterTemplatesForm;
    const attributes = this.props.form.twitterTemplates.attributes;

    return (
      <form name="twitterTemplates"
            onSubmit={this.onSubmit.bind(this)} >
        <label>Thank you tweet after donation:</label>
        <Input
          customClass='js-transaction-name'
          value={attributes.thankDonation || originalTemplates.thankDonation}
          handleChange={thankDonation => appendTwitterTemplatesForm({thankDonation})} />
        <label>Monthly thank you tweet to backers (singular):</label>
        <Input
          customClass='js-transaction-name'
          value={attributes.monthlyThankDonationsSingular || originalTemplates.monthlyThankDonationsSingular}
          handleChange={monthlyThankDonationsSingular => appendTwitterTemplatesForm({monthlyThankDonationsSingular})} />
        <label>Monthly thank you tweet to backers (plural):</label>
        <Input
          customClass='js-transaction-name'
          value={attributes.monthlyThankDonationsPlural || originalTemplates.monthlyThankDonationsPlural}
          handleChange={monthlyThankDonationsPlural => appendTwitterTemplatesForm({monthlyThankDonationsPlural})} />
        <SubmitButton />
      </form>
    );
  };

  onSubmit(event) {
    event.preventDefault();
    const twitterTemplates = this.props.form.twitterTemplates.attributes;
    this.props.updateGroup(this.props.group.id, { settings: { twitterTemplates }});
  };
}

export default connect(mapStateToProps, {
  appendTwitterTemplatesForm,
  updateGroup
})(EditTwitterTemplates);

function mapStateToProps({
  form,
  groups,
  updateGroup
}) {
  const group = values(groups)[0] || {}; // to refactor to allow only one group

  return {
    form,
    group,
    updateGroup
  };
}
