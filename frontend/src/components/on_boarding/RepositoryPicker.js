import React from 'react';

import RepositoryPickerItem from './RepositoryPickerItem';

export default class RepositoryPicker extends React.Component {

  constructor(props)
  {
    super(props);
  }
  
  render()
  {
    const { } = this.props;
    return (
      <div className="RepositoryPicker">
        <RepositoryPickerItem title="Cohesive-colors" description="Tool to create cohesive color schemes." stars="1200"/>
        <RepositoryPickerItem title="Morphin" description="Create img morphin animation with css!" stars="400"/>
        <RepositoryPickerItem title="Color-Sort" description="Tool to create cohesive color schemes." stars="302"/>
        <RepositoryPickerItem title="Triangulator" description="Tool to create cohesive color schemes." stars="100"/>
      </div>
    )
  }
}
