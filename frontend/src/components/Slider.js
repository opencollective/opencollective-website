import React, { Component, PropTypes } from 'react';

export default class Slider extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.number
  }

  static defaultProps = {
    onChange: Function.prototype,
    value: 0,
  }

  constructor(props) {
    super(props);
    this.state = {pressed: false, dragging: false};
    this.onPress = this.onPress.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onRelease = this.onRelease.bind(this);
    this.onTouchPress = this.mousifyTouchEvent(this.onPress);
    this.onTouchMove = this.mousifyTouchEvent(this.onMove);
    this.onTouchRelease = this.mousifyTouchEvent(this.onRelease);
  }

  render() {
    return (
      <div 
        ref="container"
        className={`Slider-container ${this.props.className}`}
        onMouseDown={this.onPress}
        onMouseMove={this.onMove}
        onMouseUp={this.onRelease}
        onTouchStart={this.onTouchPress}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchRelease}
        onTouchCancel={this.onTouchRelease}
        >
        <div className='Slider-bar' style={{width: `${this.props.value}%`}}>
          <div className='Slider-handle'></div>
        </div>
      </div>
    );
  }

  getContainerRect()
  {
    return this.refs.container.getBoundingClientRect();
  }

  getPercentage(clientX)
  {
    const containerRect = this.getContainerRect();
    if (clientX > containerRect.right) return 100;
    if (clientX < containerRect.left) return 0;
    return 100 * ((clientX - containerRect.left)/containerRect.width);
  }

  mousifyTouchEvent(eventHandler)
  {
    return function mousifier(ev) {
      eventHandler(ev.touches[0]);
      ev.preventDefault();
    }
  }

  onPress(ev){
    const nextPercentage = this.getPercentage(ev.clientX);
    if (this.props.value !== nextPercentage)
    {
      this.props.onChange(nextPercentage, this.props.value);
    }
    window.addEventListener('mousemove', this.onMove, true);
    window.addEventListener('mouseup', this.onRelease, true);
    window.addEventListener('touchmove', this.onTouchMove, true);
    window.addEventListener('touchend', this.onTouchRelease, true);
    window.addEventListener('touchcancel', this.onTouchRelease, true);
    this.setState({pressed: true});
  }

  onMove(ev){
    if (this.state.pressed)
    {
      const nextPercentage = this.getPercentage(ev.clientX);
      if (this.props.value !== nextPercentage)
      {
        this.props.onChange(nextPercentage, this.props.value);      
        this.setState({dragging: true});
      }
    }
  }

  onRelease(){
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('mouseup', this.onRelease);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchRelease);
    window.removeEventListener('touchcancel', this.onTouchRelease);
    this.setState({pressed: false, dragging: false});
  }
}
