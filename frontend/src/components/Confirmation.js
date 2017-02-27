import React, {Component, PropTypes} from 'react';

export default class Confirmation extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      image = '/public/images/happy-mail.svg',
      link,
      href
    } = this.props;

    return (
      <div className='Confirmation'>
        <img className='image' src={image}/>
        {this.props.children}
        {href && link && <a className='green-link' href={href}>{link}</a>}
      </div>      
    );
  }

}

Confirmation.propTypes = {
  image: PropTypes.string,
  link: PropTypes.string,
  href: PropTypes.string
};
