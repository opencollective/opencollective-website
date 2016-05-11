import React from 'react';

export default class ContributorPickerItem extends React.Component {

  constructor(props)
  {
    super(props);
  }
  
  render()
  {
    const { active } = this.props;
    return (
      <div className="ContributorPickerItem">
      	<img src="/static/images/add-contributor.svg" width="32px" height="32px" />
      	<span>Add Contributor</span>
      	<i>Remove</i>
      </div>
    )
  }
}
