import React from 'react';

import ContributorPickerItem from './ContributorPickerItem'

export default class ContributorPicker extends React.Component {

  constructor(props)
  {
    super(props);
  }
  
  render()
  {
    const {  } = this.props;
    return (
      <div className="ContributorPicker">
      	<ContributorPickerItem />

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
