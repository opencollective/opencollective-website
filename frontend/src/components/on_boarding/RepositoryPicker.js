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
          const topics = repo.topics && repo.topics.length > 1 ? repo.topics.join(', ').concat(', open source') : 'open source';
          return (
            <RepositoryPickerItem
              key={repo.fullName}
              title={repo.fullName}
              description={repo.description}
              stars={repo.stars}
              selected={selectedRepo === repo.fullName || repositories.length === 1}
              onClick={() => onSelect(repo.title, repo.owner, topics )}
            />
          )
        })}
      </div>
    )
  }
}
