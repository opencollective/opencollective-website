import React, { Component } from 'react';

class EditCollectiveEditCog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      highlightField: null,
      highlightLabel: null,
      highlightIndex: null,
    };
    this.toggleMenuRef = this.toggleMenu.bind(this);
    this.onClickOutsideRef = this.onClickOutside.bind(this);
  }
  render() {
    const { style, onEdit, onRemove } = this.props;
    const { showMenu } = this.state;
    return (
      <div className='EditCog' style={ style } onClick={ this.toggleMenuRef }>
        {showMenu && (
          <div className='EditCog-Menu'>
            <ul>
              <li onClick={ onEdit }>Edit</li>
              <li onClick={ onRemove }>Remove</li>
            </ul>
          </div>
        )}
      </div>
    )    
  }
  onClickOutside() {
    this.setState({showMenu: false});
  }
  componentDidMount() {
    this.onClickOutsideRef = this.onClickOutside.bind(this);
    document.addEventListener('click', this.onClickOutsideRef);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutsideRef);
  }  
  toggleMenu(e) {
    this.setState({showMenu: !this.state.showMenu});
    e.nativeEvent.stopImmediatePropagation();
  }
}

export default EditCollectiveEditCog;
