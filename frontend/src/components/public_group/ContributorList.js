import React from 'react';

import UserPhoto from '../UserPhoto';


export default class ContributorList extends React.Component {

  constructor(props) {
    super(props);
  }

 render() { 
  // const {user, title, onClick} = this.props;
  return (
      <div className='ContributorList'>
        <div className='ContributorList-left'></div>
        <UserPhoto user={{avatar:''}} addBadge={true} customBadge='svg-star-badge' />
        <div className='ContributorList-right'></div>
      </div>
    );
  }
}
