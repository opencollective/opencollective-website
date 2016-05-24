import React from 'react';

import RepositoryPickerItem from './RepositoryPickerItem';

export default class RepositoryPicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRepo: ''
    };
  }

  render() {
    const { onSelect, repositories, selectedRepo } = this.props;
    return (
      <div className="RepositoryPicker">
        {repositories && repositories.map((repo) => {
          return (
            <RepositoryPickerItem
              key={repo.title}
              title={repo.title}
              description={repo.description}
              stars={repo.stars}
              selected={selectedRepo === repo.title || repositories.length === 1}
              onClick={() => onSelect(repo.title)}
            />
          )
        })}
      </div>
    )
  }
}
