import React from 'react';

export default class RepositoryPickerItem extends React.Component {

  constructor(props)
  {
    super(props);
  }
  
  render()
  {
    const { title, description, stars } = this.props;
    return (
      <div className="RepositoryPickerItem">
        <div>
          <span className="-title">{title}</span>
          <span className="-stars">{stars}</span>
        </div>
        <div className="-description">
          {description}
        </div>
      </div>
    )
  }
}
