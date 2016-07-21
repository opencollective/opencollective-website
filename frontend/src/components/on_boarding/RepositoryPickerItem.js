import React from 'react';

export default class RepositoryPickerItem extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { title, description, stars, selected, onClick } = this.props;
    return (
      <div className={`RepositoryPickerItem ${selected ? 'RepositoryPickerItem--selected' : ''}`} onClick={onClick}>
        <div>
          <span className="-title">{title}</span>
          <span className="-stars">
            <img src="/static/images/star.svg" />
            {stars}
          </span>
        </div>
        <div className="-description">
          {description}
        </div>
      </div>
    )
  }
}
