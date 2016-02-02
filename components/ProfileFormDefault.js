import React, { Component } from 'react';
import any from 'lodash/collection/any';

import ProfilePhoto from '../components/ProfilePhoto';
import ProfilePreapproved from './ProfilePreapproved';
import TableHead from './TableHead';
import TableRow from './TableRow';

class ProfileFormDefault extends Component {
  render() {
    const {
      user,
      logoutAndRedirect,
      hasPreapproved,
      preapprovalDetails,
      groups
    } = this.props;
    const { paypalEmail, email, avatar, name } = user;

    return (
      <div className='ProfileForm'>
        <div className='Profile-header'>
          <ProfilePhoto url={avatar} />
          <div className='Profile-name'>
            {name}
          </div>
        </div>
        <TableHead value='Personal email' />
        <TableRow value={email} />

        <TableHead value='Paypal email' />
        <TableRow value={paypalEmail || 'No email'} />

        { preapprovalDetails.senderEmail ? (
          <div>
            <TableHead value='Paypal preapproved email' />
            <TableRow value={preapprovalDetails.senderEmail} />
          </div>
          ) : null}

        {hasPreapproved ? <ProfilePreapproved {...this.props} /> : null}

        {this.stripeInfo(groups)}

        <div className='ProfileForm-buttonContainer'>
          <div
            className='Button ProfileForm-button'
            onClick={this.toggleEditMode.bind(this)}>
            Edit profile
          </div>
        </div>
        <div className='ProfileForm-buttonContainer'>
          <div
            className='ProfileForm-logout'
            onClick={logoutAndRedirect}>
            Sign Out
          </div>
        </div>

      </div>
    );
  }

  toggleEditMode() {
    const { isEditMode, setEditMode } = this.props;

    setEditMode(!isEditMode);
  }

  stripeInfo(groups) {
    const hasStripeEmail = any(groups, g => {
      return g.stripeManagedAccount && g.stripeManagedAccount.stripeEmail;
    });

    if (hasStripeEmail) {
      return (
        <div>
          <TableHead value='Group Stripe account' />
          {groups.map(group => {
            return (
              <TableRow
                key={group.id}
                value={group.stripeManagedAccount.stripeEmail} />
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  }

}

export default ProfileFormDefault;

