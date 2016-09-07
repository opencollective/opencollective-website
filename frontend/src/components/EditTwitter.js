import React, { Component } from 'react';
import Checkbox from './Checkbox';
import Input from './Input';
import SubmitButton from './SubmitButton';

import { connect } from 'react-redux';
import values from 'lodash/object/values';
import updateForm from '../actions/form/update_twitter_config';
import updateGroup from '../actions/groups/updateSettings';

export class EditTwitter extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  };

  componentWillMount() {
    const form = this.props.form;
    form.twitter.attributes = this.props.group.settings.twitter;
    this.setState({form});
  }

  render() {
    const updateForm = this.props.updateForm;
    const attributes = this.props.form.twitter.attributes;

    return (
      <form name="twitter"
            onSubmit={this.onSubmit.bind(this)} >

        <div className="EditTwitter">
          <label className="EditTwitter-title">Thank backer after donation</label>
          <label>Opt-in?</label>
          <Checkbox checked={attributes.thankDonationEnabled}
                    onChange={thankDonationEnabled => updateForm({ thankDonationEnabled })} />
          <div className="EditTwitter">
            <label className="EditTwitter-title">Template</label>
            <Input
              customClass='js-transaction-name'
              value={attributes.thankDonation}
              handleChange={thankDonation => updateForm({thankDonation})} />
          </div>
        </div>

        <div className="EditTwitter">
          <label className="EditTwitter-title">Monthly thanks to backers</label>
          <label>Opt-in?</label>
          <Checkbox checked={attributes.monthlyThankDonationsEnabled}
                    onChange={monthlyThankDonationsEnabled => updateForm({ monthlyThankDonationsEnabled })} />
          <div className="EditTwitter">
            <label className="EditTwitter-title">Template (singular)</label>
            <Input
              customClass='js-transaction-name'
              value={attributes.monthlyThankDonationsSingular}
              handleChange={monthlyThankDonationsSingular => updateForm({monthlyThankDonationsSingular})} />
            <label className="EditTwitter-title">Template (plural)</label>
            <Input
              customClass='js-transaction-name'
              value={attributes.monthlyThankDonationsPlural}
              handleChange={monthlyThankDonationsPlural => updateForm({monthlyThankDonationsPlural})} />
          </div>
        </div>

        <label>
          ($backer: backer twitter handle; $backerCount: amount of backers; $backerList: list of known backer twitter handles.)
        </label>

        <SubmitButton />
      </form>
    );
  };

  onSubmit(event) {
    event.preventDefault();
    const twitter = this.props.form.twitter.attributes;
    this.props.updateGroup(this.props.group.id, { settings: { twitter }});
  };
}

export default connect(mapStateToProps, {
  updateForm,
  updateGroup
})(EditTwitter);

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
