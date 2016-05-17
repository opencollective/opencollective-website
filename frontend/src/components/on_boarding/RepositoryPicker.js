import React from 'react';

import RepositoryPickerItem from './RepositoryPickerItem';

export default class RepositoryPicker extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      selectedRepo: ''
    };
  }
  
  render()
  {
    const { onSelect, selectedRepo } = this.props;
    const repositories = [ // SAMPLE PROP
      {title: 'Cohesive-colors', description: 'Tool to create cohesive color schemes.', stars: 1200},
      {title: 'Morphin', description: 'Create img morphin animation with css!', stars: 400},
      {title: 'Color-Sort', description: 'Tool to create cohesive color schemes.', stars: 302},
      {title: 'Triangulator', description: 'Tool to create cohesive color schemes.', stars: 100},
    ];
    return (
      <div className="RepositoryPicker">
        {repositories.map((repo) => {
          return (
            <RepositoryPickerItem
              key={repo.title}
              title={repo.title}
              description={repo.description}
              stars={repo.stars}
              selected={selectedRepo === repo.title}
              onClick={() => onSelect(repo.title)}
            />
          )
        })}
      </div>
    )
  }
}
