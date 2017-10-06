import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// components
import AddFundsForm from '../components/AddFundsForm';
import PublicGroupThanks from '../components/PublicGroupThanks';

// actions
import addFundsToCollective from '../actions/groups/addfunds';
import notify from '../actions/notification/notify';
import appendAddFundsForm from '../actions/form/append_addfunds';
import validateAddFundsRequest from '../actions/form/validate_addfunds';
import resetAddFundsForm from '../actions/form/reset_addfunds';

// selectors
import {
  getAddFundsFormAttrSelector,
  getAddFundsFormInProgressSelector,
  getAddFundsFormErrorSelector } from '../selectors/form';
import {
  getLoggedInUserProfileSelector } from '../selectors/users';
import {
  getI18nSelector } from '../selectors/collectives';

export class AddFundsContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showThankYouMessage: false,
    };
  }

  render() {
    const {
      onCancel,
      i18n,
      addFundsFormRequestInProgress,
      host,
      collective,
      appendAddFundsForm,
      addFundsFormAttributes,
      addFundsFormError
    } = this.props;

    return (
      <div>
      {this.state.showThankYouMessage &&
        <div>
          <PublicGroupThanks message="Funds added" />
          <div style={{padding: '20px', textAlign: 'center', paddingTop: 0}}>
            <span id='AddFundsForm-again' className='AddFundsForm-switch' onClick={() => this.setState({showThankYouMessage: false})} >Add more funds</span>
          </div>
        </div>}
      {!this.state.showThankYouMessage &&
        <AddFundsForm
          onSubmit={ createManualDonation.bind(this) } 
          onCancel={ onCancel }
          i18n={ i18n }
          inProgress={ addFundsFormRequestInProgress }
          collective={ collective }
          validationError={ addFundsFormError }
          onChange={ appendAddFundsForm }
          attributes={ addFundsFormAttributes }
          host= { host } />}
      </div>
    );
  }
}

export function createManualDonation() {
  const {
    notify,
    addFundsToCollective,
    validateAddFundsRequest,
    collective,
    addFundsFormAttributes,
    resetAddFundsForm
  } = this.props;

  const attributes = {
    ...addFundsFormAttributes,
    totalAmount: Math.round(100 * addFundsFormAttributes.amountText)
  };
  delete attributes.amountText;
  delete attributes.amount;
  console.log(">>> attributes", attributes);

  return validateAddFundsRequest(attributes)
  .then(() => addFundsToCollective(collective.slug, {
    ...attributes,
    currency: collective.currency
  }))
  .then(() => {
    window.scrollTo(0, 0);
    this.setState({ showThankYouMessage: true })
  })
  .then(() => {
    resetAddFundsForm();
  })
  .catch(error => notify('error', error.message));
}


const mapStateToProps = createStructuredSelector({
  addFundsFormAttributes: getAddFundsFormAttrSelector,
  addFundsFormRequestInProgress: getAddFundsFormInProgressSelector,
  addFundsFormError: getAddFundsFormErrorSelector,

  // auth related
  host: getLoggedInUserProfileSelector,

  // other
  i18n: getI18nSelector,
});

export default connect(mapStateToProps, {
  addFundsToCollective,
  appendAddFundsForm,
  validateAddFundsRequest,
  notify,
  resetAddFundsForm
})(AddFundsContainer);
