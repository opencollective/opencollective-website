import React from 'react';

export default class ContributorPickerItem extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      showContributorList: true,
      filterValue: ''
    };
  }

  renderAvailableContributorsList()
  {
    const { available, onChoose } = this.props;
    const { filterValue } = this.state;
    return available
      .filter((contributor) => {return !filterValue || contributor.name.indexOf(filterValue) !== -1 })
      .sort((A, B) => B.contributions - A.contributions)
      .map((contributor, index) => {
      return (
        <li key={index} onClick={() => {
          this.setState({showContributorList: true});
          onChoose(contributor);
          }}
        >
          <img src={contributor.avatar} width="32px" height="32px" />
          <span>{contributor.name}</span>
          <div>{contributor.contributions} contributions</div>
        </li>
      )
    });
  }

  render()
  {
    const { name, avatar, onRemove } = this.props;
    const { showContributorList, filterValue } = this.state;
    return (
      <div>
        <div className={`ContributorPickerItem ${name ? 'ContributorPickerItem--active': ''}`} onClick={() => this.setState({showContributorList: !showContributorList})}>
        	<img src={name ? avatar : "/static/images/add-contributor.svg"} width="32px" height="32px" />
        	<span>{name || 'Add Contributor'}</span>
        	{name && <i onClick={onRemove}>Remove</i>}
        </div>

        {!name && showContributorList &&
          <div className="ContributorPickerItemSearch">
            <input
              ref='input'
              placeholder="filter repository contributors"
              onInput={() => {
                this.setState({filterValue: this.refs.input.value});
              }}
              value={filterValue}
            />
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
