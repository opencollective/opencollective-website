import React from 'react';

import ContributorPickerItem from './ContributorPickerItem'

export default class ContributorPicker extends React.Component {

  constructor(props)
  {
    super(props);
  }

  renderChosenContributors()
  {
    const { chosen, onRemove } = this.props;
    return chosen.map((contributor, index) => {
      return (
        <ContributorPickerItem
          key={index}
          name={contributor.name}
          avatar={contributor.avatar}
          onRemove={() => onRemove(contributor)}
        />
      )
    });
  }

  render()
  {
    const { available, onChoose } = this.props;
    return (
      <div className="ContributorPicker">
        {this.renderChosenContributors()}
        {available.length ? <ContributorPickerItem available={available} onChoose={onChoose} /> : null}
      </div>
    )
  }
}
