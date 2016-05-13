import React from 'react';

import ContributorPickerItem from './ContributorPickerItem'

export default class ContributorPicker extends React.Component {

  constructor(props)
  {
    super(props);
  }
 
  renderChosenContributors()
  {
    const { chosen } = this.props;
    return chosen.map((contributor, index) => {
      return <ContributorPickerItem key={index} name={contributor.name} avatar={contributor.avatar} />
    });
  }

  render()
  {
    const { available } = this.props;
    return (
      <div className="ContributorPicker">
        {this.renderChosenContributors()}
      	<ContributorPickerItem available={available} />
      </div>
    )
  }
}
