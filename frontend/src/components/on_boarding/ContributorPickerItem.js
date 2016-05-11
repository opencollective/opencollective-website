import React from 'react';

export default class ContributorPickerItem extends React.Component {

  constructor(props)
  {
    super(props);
  }
  
  render()
  {
    const { } = this.props;
    return (
      <div>
        <div className="ContributorPickerItem">
        	<img src="/static/images/add-contributor.svg" width="32px" height="32px" />
        	<span>Add Contributor</span>
        	<i>Remove</i>
        </div>
        <div className="ContributorPickerItemSearch">
          <input placeholder="filter repository contributors" />
          <ul>
            <li>
              <img src="" width="32px" height="32px" />
              <span>Don Gill</span>
            </li>
            <li>B</li>
            <li>C</li>
          </ul>
        </div>
      </div>
    )
  }
}
