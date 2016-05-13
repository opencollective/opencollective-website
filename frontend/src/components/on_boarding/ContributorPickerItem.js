import React from 'react';

export default class ContributorPickerItem extends React.Component {

  constructor(props)
  {
    super(props);
  }
  
  renderAvailableContributorsList()
  {
    const { available } = this.props;
    return available.map((contributor, index) => {
      return (
        <li key={index}>
          <img src={contributor.avatar} width="32px" height="32px" />
          <span>{contributor.name}</span>
        </li>
      )
    });
  }

  render()
  {
    const { name, avatar } = this.props;
    return (
      <div>
        <div className={`ContributorPickerItem ${name ? 'ContributorPickerItem--active': ''}`}>
        	<img src={name ? avatar : "/static/images/add-contributor.svg"} width="32px" height="32px" />
        	<span>{name || 'Add Contributor'}</span>
        	{name && <i>Remove</i>}
        </div>
        {!name && 
          <div className="ContributorPickerItemSearch">
            <input placeholder="filter repository contributors" />
            <div className="ContributorPickerItemSearch-list-container">
              <ul>
                {this.renderAvailableContributorsList()}
              </ul>
            </div>
          </div>
        }
      </div>
    )
  }
}
